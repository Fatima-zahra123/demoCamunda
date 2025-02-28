import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import {useEffect, useRef, useState} from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule, CamundaPlatformTooltipProvider
} from 'bpmn-js-properties-panel';
import magicModdleDescriptor from './descriptors/magic';
import magicPropertiesProviderModule from './';
import {createBpmnFileFromXml,updateBpmnFileFromXml} from "./service/bpmnService.jsx";
import {useLocation} from "react-router-dom";





const BpmnEditorSB = () => {
    const containerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const modelerRef = useRef(null);
    const location = useLocation();
    const { info } = location.state || {};
    const xml = info?.content || null;
    const processName = info?.name || "defaultName";
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Replace invalid QName characters with underscores
    const [isCreated, setIsCreated] = useState(false);
    const [bpmnFileId, setBpmnFileId] = useState(null); // State to store the BPMN file ID


    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,CamundaPlatformTooltipProvider],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor,
                magic: magicModdleDescriptor},
        });


        const importXml = async () => {
            try {
                if (xml) {
                    setIsCreated(true);
                    setBpmnFileId(info?.id);
                    await modelerRef.current.importXML(xml);
                } else {
                    await modelerRef.current.createDiagram();
                    setTTL();
                }

            } catch (err) {
                console.error("Erreur d'import ou de création du diagramme", err);
            }
        };

        const setTTL = () => {
            const elementRegistry = modelerRef.current.get('elementRegistry');
            const modeling = modelerRef.current.get('modeling');
            const processElement = elementRegistry.get('Process_1'); // Adjust the ID as needed
            if (processElement) {
                modeling.updateProperties(processElement, {
                    'camunda:historyTimeToLive': 180,
                    'isExecutable': true,
                    'name': processName,
                    'id': sanitizedProcessName
                });
            }
        };

        importXml();
        return () => modelerRef.current.destroy();
    }, [xml]);

    // Fonction pour sauvegarder le fichier
    const handleSave = async () => {
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const name = info.name.toString().trim() + ".bpmn";
            const description = info.description;

            if (!isCreated) {
                const response = await createBpmnFileFromXml(name, description, xml);
                console.log('BPMN File created:', response);
                setIsCreated(true);
                setBpmnFileId(response.id); // Store the created BPMN file ID
            } else {
                const response = await updateBpmnFileFromXml(bpmnFileId, name, description, xml);
                console.log('BPMN File updated:', response);
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "600px" }}>
            <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 self-end"
            >
                Enregistrer
            </button>
            <div style={{ display: "flex", flex: 1 }}>
                <div ref={containerRef} style={{ flex: 3, border: "1px solid #ccc" }} />
                <div ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto" }} />
            </div>
        </div>
    );
};

export default BpmnEditorSB;
