import  { useEffect, useRef, useState} from 'react';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import camundaPlatformBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import './style.css'
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule, CamundaPlatformTooltipProvider
} from "bpmn-js-properties-panel";
import magicModdleDescriptor from "../descriptors/magic.json";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import minimapModule from 'diagram-js-minimap';
import {useLocation, useNavigate} from "react-router-dom";
import {createBpmnFileFromXml, updateBpmnFileFromXml} from "../service/bpmnService.jsx";
import {deploy} from "../service/bpmnService.jsx";
import MagicPropertiesProvider from '../MagicPropertiesProvider.js';
import FormPropertiesProvider from "../FormPropertiesProvider.js";

const CamundaEditor = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);

    // 🔹 Charger formData depuis localStorage
    const storedFormData = JSON.parse(localStorage.getItem("formData")) || {};

    // 🔹 Utiliser formData pour définir les valeurs par défaut
    const location = useLocation();
    const { info } = location.state || {};
    const savedXml = localStorage.getItem("bpmnXml"); // Récupérer le XML BPMN stocké
    const xml = info ? info.content : savedXml;
    const processName = storedFormData.name || "defaultName";
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Nettoyer le nom

    const [isCreated, setIsCreated] = useState(() => {
        return JSON.parse(localStorage.getItem("isCreated")) || false;});
    const [bpmnFileId, setBpmnFileId] = useState(() => {
        return JSON.parse(localStorage.getItem("BpmnId")) || null;});


    const [isValid, setisValid] = useState(false);

    const navigate=useNavigate();


    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            propertiesPanel: {parent: propertiesPanelRef.current},
            additionalModules: [{
                __init__: [ 'magicPropertiesProvider'],
                magicPropertiesProvider: [ 'type', MagicPropertiesProvider ]
            },{
                __init__: [ 'formPropertiesProvider'],
                formPropertiesProvider: [ 'type', FormPropertiesProvider ]
            }],
            moddleExtensions: { camunda: camundaModdleDescriptor,
                magic: magicModdleDescriptor},


        });

        const importXml = async () => {
            try {
                if (xml) {
                    await modelerRef.current.importXML(xml);
                } else {
                    await modelerRef.current.createDiagram();
                    setTTL();
                }

                // 🔹 Écouter les modifications du diagramme

            } catch (err) {
            }
        };

        const setTTL = () => {
            const elementRegistry = modelerRef.current.get('elementRegistry');
            const modeling = modelerRef.current.get('modeling');
            const processElement = elementRegistry.get('Process_1'); // Adjust the ID as needed
            console.log(elementRegistry)
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
            console.log(xml)
            const name = storedFormData.name;
            const description = storedFormData.description;
            const code = storedFormData.code;
            if (!isCreated) {
                const response = await createBpmnFileFromXml(name, description, xml,code,isValid);
                localStorage.setItem("bpmnXml", xml);
                localStorage.setItem("isCreated", true);
                localStorage.setItem("BpmnId", response.id);
                console.log('BPMN File created:', response);
                setIsCreated(true);
                setBpmnFileId(response.id); // Store the created BPMN file ID
                return response;
            } else {
                const response = await updateBpmnFileFromXml(bpmnFileId, name, xml,isValid);
                console.log('BPMN File updated:', response);
                localStorage.setItem("bpmnXml", xml);
                return response;
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };

    useEffect(() => {
        if (isValid) {
            handleSave().then((r) => {
                deploy(r.name, r.content)
                    .then((r) => console.log(r))
                    .catch((err) => console.log(err));
            });
        }
    }, [isValid]);

    const handleValidate = async () => {
        setisValid(true);

    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh"}} className='relative h-sceen'>
            <div  style={{ display: "flex", flexDirection: "column"}} className="flex flex-column  mb-4 absolute bottom-10 left-3 z-10 ">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
                >
                    Enregistrer
                </button>
                <button
                    onClick={handleValidate}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-2"
                >
                    Valider
                </button>
                <button
                    onClick={()=>{navigate(-1);}}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-2"
                >
                    Retour
                </button>

            </div>
            <div style={{ display: "flex", flex: 1 }}>
                <div ref={containerRef} style={{ flex: 3, border: "1px solid #ccc" ,position:"relative"}} >

                    <ul className="absolute bottom-10 right-0 m-4 z-10">
                        <li className="bg-gray-500  text-white   mb-2 text-center py-2 px-4">
                            <button onClick={handleZoomReset} >
                               0
                            </button>
                        </li>
                        <li className="bg-gray-500  text-white   mb-2 text-center py-2 px-4">
                            <button onClick={handleZoomIn} >
                                +
                            </button>
                        </li>
                        <li className="bg-gray-500  text-white   mb-2 text-center py-2 px-4">
                            <button onClick={handleZoomOut} >
                                -
                            </button>
                        </li>
                    </ul>
                    </div>
                <div ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto" }} />
            </div>
        </div>
    );
};

export default CamundaEditor;