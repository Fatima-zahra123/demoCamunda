import {useEffect, useRef, useState} from 'react';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import {useBeforeUnload, useLocation} from "react-router-dom";
import {deploy, getBpmnById, updateBpmnFileFromXml} from "../service/bpmnService.jsx";
import FormPropertiesProvider from "../FormPropertiesProvider.js";
import {getFormsByCode} from "../service/formsService.jsx";
import ConfirmationPopup from "./ConfirmationGroup.jsx";
import { debounce } from 'lodash';


const CamundaEditorUpdate = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const [xmlBpmn,setXmlBpmn]=useState(() => {
        return localStorage.getItem("bpmnXml") || null;});
    const location = useLocation();
    const { id } = location.state || null;
    const [data,setData]=useState({})
    const [isValid,setIsValid]=useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
    const [popupAction, setPopupAction] = useState(null); // State to determine the action to perform
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); // State for confirmation popup
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    useEffect(()=>
    {

        const fetchBpmnById=async () => {
            try {
                 // Assurez-vous que getFormById() retourne une promesse
                return await getBpmnById(id);
            } catch (err) {
                console.error("Erreur lors de la récupération des données du formulaire:", err);
            }
        };

        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [{
                __init__: [ 'formPropertiesProvider'],
                formPropertiesProvider: [ 'type', FormPropertiesProvider ]
            }
              ],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor
               },
        });


        const loadXml = async () => {
            const storedXml = localStorage.getItem("bpmnXml");
            if (storedXml) {
                await modelerRef.current.importXML(storedXml);
            } else {
                const response = await fetchBpmnById();
                getFormsByCode(response.codeProcess).then(r => localStorage.setItem("Forms", JSON.stringify(r)));
                await modelerRef.current.importXML(response.content);
                setData(response);
                setXmlBpmn(response.content);
            }
        };

        loadXml();

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

    },[xmlBpmn]);

    useBeforeUnload((event) => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';

        }
        localStorage.removeItem("bpmnXml");

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

        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const response = await updateBpmnFileFromXml(id,xml,isValid);
            console.log('BPMN File updated:', response,isValid);
            return response;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };
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
            await handleSaveXml().then(() => {
                setIsConfirmationVisible(true);
                setHasUnsavedChanges(false);
            }).catch(() => {
                setIsErrorVisible(true);
            });

        } else if (popupAction === 'validate') {
            setIsValid(true);
        }
    };

    const handleCancel = () => {
        setIsPopupVisible(false);
    };

    const handleConfirmationClose = () => {
        setIsConfirmationVisible(false);
    };

    const handleErrorClose = () => {
        setIsErrorVisible(false);
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


            {isConfirmationVisible && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white p-4 rounded shadow-lg'>
                        <p>La modification du BPMN est effectuée avec succès</p>
                        <button onClick={handleConfirmationClose} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4'>
                            OK
                        </button>
                    </div>
                </div>
            )}


            {isErrorVisible && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white p-4 rounded shadow-lg'>
                        <p>Erreur lors de la modification du BPMN</p>
                        <button onClick={handleErrorClose} className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4'>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CamundaEditorUpdate;