import React, {useEffect, useRef, useState} from 'react';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import camundaPlatformBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-platform';

import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule, CamundaPlatformTooltipProvider
} from "bpmn-js-properties-panel";
import magicModdleDescriptor from "./descriptors/magic.json";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import minimapModule from 'diagram-js-minimap';
import {useLocation} from "react-router-dom";
import {createBpmnFileFromXml, updateBpmnFileFromXml} from "./service/bpmnService.jsx";

const CamundaEditor = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const location = useLocation();
    const { info } = location.state || {};
    const xml = info?.content || null;
    const processName = info?.name || "defaultName";
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Replace invalid QName characters with underscores
    const [isCreated, setIsCreated] = useState(false);
    const [bpmnFileId, setBpmnFileId] = useState(null); // State to store the BPMN file ID
    console.log('info:', info); // Debug log
    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [minimapModule,BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,CamundaPlatformTooltipProvider,camundaPlatformBehaviors],
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

        return () => {
            modelerRef.current.destroy();
        };
    }, [xml]);

    // Function to reset zoom
    const handleZoomReset = () => {
        const canvas = modelerRef.current.get('canvas');
        canvas.zoom('fit-viewport');
    };

    // Function to zoom in
    const handleZoomIn = () => {
        const canvas = modelerRef.current.get('canvas');
        const currentZoom = canvas.zoom();
        canvas.zoom(currentZoom + 0.1);
    };

    // Function to zoom out
    const handleZoomOut = () => {
        const canvas = modelerRef.current.get('canvas');
        const currentZoom = canvas.zoom();
        canvas.zoom(currentZoom - 0.1);
    };
    // Fonction pour sauvegarder le fichier
    const handleSave = async () => {

        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const name = info.name.toString().trim() + ".bpmn";
            const description = info.description;

            if (!isCreated) {
                console.log('info:', info.code); // Debug log
                const response = await createBpmnFileFromXml(name, description, xml,info.code);
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
            <div className="flex flex-row  justify-around mb-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
                >
                    Enregistrer
                </button>
                <button
                    onClick={handleZoomReset}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-2"
                >
                    Reset Zoom
                </button>
                <button
                    onClick={handleZoomIn}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-2"
                >
                    Zoom In
                </button>
                <button
                    onClick={handleZoomOut}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mb-2"
                >
                    Zoom Out
                </button>
            </div>
            <div style={{ display: "flex", flex: 1 }}>
                <div ref={containerRef} style={{ flex: 3, border: "1px solid #ccc" }} />
                <div ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto" }} />
            </div>
        </div>
    );
};

export default CamundaEditor;