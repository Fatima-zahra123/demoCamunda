import {useCallback, useEffect, useRef, useState} from 'react';
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
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import minimapModule from 'diagram-js-minimap';
import {useNavigate, unstable_usePrompt, useBeforeUnload, useLocation} from "react-router-dom";
import {createBpmnFileFromXml, getBpmnById, updateBpmnFileFromXml} from "../service/bpmnService.jsx";
import {deploy} from "../service/bpmnService.jsx";
import FormPropertiesProvider from "../FormPropertiesProvider.js";
import {getFormsByCode} from "../service/formsService.jsx";
import ConfirmationPopup from "./ConfirmationGroup.jsx";
import { debounce } from 'lodash';
import usePrompt from "./usePrompt.jsx";

const CamundaEditor = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);

    // 🔹 Charger formData depuis localStorage
    const storedFormData = JSON.parse(localStorage.getItem("formData")) || {};

    const [xmlBpmn,setXmlBpmn]=useState(() => {
        return localStorage.getItem("bpmnXml") || null;});
    const [isCreated, setIsCreated] = useState(() => {
        return JSON.parse(localStorage.getItem("isCreated")) || false;});
    const [bpmnFileId, setBpmnFileId] = useState(() => {
        return JSON.parse(localStorage.getItem("BpmnId")) || null;});


    const [isValid, setisValid] = useState(false);

    const navigate=useNavigate();

    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupAction, setPopupAction] = useState(null); // State to determine the action to perform
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        getFormsByCode(storedFormData.code).then(r=>localStorage.setItem("Forms",JSON.stringify(r)));
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [{
                __init__: [ 'formPropertiesProvider'],
                formPropertiesProvider: [ 'type', FormPropertiesProvider ]
            }
                ,
                minimapModule,BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,CamundaPlatformTooltipProvider,camundaPlatformBehaviors],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor,
               },
        });

        const importXml = async () => {
            try {
                if (xmlBpmn) {
                    await modelerRef.current.importXML(xmlBpmn);
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
            if (processElement) {
                modeling.updateProperties(processElement, {
                    'camunda:historyTimeToLive': 180,
                    'isExecutable': true,
                    'name': storedFormData.name,
                    'id': storedFormData.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                });
            }
        };



        importXml();



        const handleElementsChanged = debounce(() => {
            setHasUnsavedChanges(true);
            modelerRef.current.saveXML({ format: true }).then(({ xml }) => {
                localStorage.setItem("bpmnXml", xml);
            });
        }, 500); // Attendre 500ms avant de sauvegarder pour éviter les appels trop fréquents

        modelerRef.current.on('elements.changed', handleElementsChanged);

        return () => {
            modelerRef.current.off('elements.changed', handleElementsChanged);

            modelerRef.current.destroy();
        };
    }, [xmlBpmn]);


    useBeforeUnload((event) => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';

            if (!isCreated) {
                localStorage.removeItem("bpmnXml");
            }
            else
            {
                getBpmnById(bpmnFileId).then(r=>{localStorage.setItem("bpmnXml",r.content);
                                setXmlBpmn(r.content);
                });
            }
        }
    });


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
    const handleSaveXml = async () => {
        setHasUnsavedChanges(false);
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });

            if (!isCreated) {
                const response = await createBpmnFileFromXml(storedFormData.name, storedFormData.description, xml,storedFormData.code,isValid);
                localStorage.setItem("bpmnXml", xml);
                localStorage.setItem("isCreated", true);
                localStorage.setItem("BpmnId", response.id);
                setIsCreated(true);
                setBpmnFileId(response.id); // Store the created BPMN file ID
                console.log('BPMN File created:', response);
                return response;
            } else {
                const response = await updateBpmnFileFromXml(bpmnFileId, storedFormData.name, xml,isValid);
                localStorage.setItem("bpmnXml", xml);
                console.log('BPMN File updated:', response);
                return response;
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    }
    // Fonction pour sauvegarder le fichier
    const handleSave = async () => {
            showPopup('save');

    };

    useEffect(() => {
        if (isValid) {
            handleSaveXml().then((r) => {
                deploy(r.id)
                    .then((r) => console.log(r))
                    .catch((err) => console.log(err));
            });
        }
    }, [isValid]);

    const handleValidate = async () => {
        showPopup('validate');

    };

    const showPopup = (action) => {
        setPopupAction(action);
        setIsPopupVisible(true);
    };

    const handleConfirm = async () => {
        setIsPopupVisible(false);
        if (popupAction === 'save') {
            await handleSaveXml();
        } else if (popupAction === 'validate') {
            setisValid(true);
            console.log("validate");
        }
    };

    const handleCancel = () => {
        setIsPopupVisible(false);
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

            {isPopupVisible && (
                <ConfirmationPopup
                    message='Are you sure you want to proceed?'
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default CamundaEditor;