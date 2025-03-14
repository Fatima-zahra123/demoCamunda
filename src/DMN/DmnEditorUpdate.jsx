import {useEffect, useRef, useState} from "react";


import { CamundaPlatformModeler as DmnModeler } from 'camunda-dmn-js';
import 'camunda-dmn-js/dist/assets/camunda-platform-modeler.css';
import {
    CamundaPropertiesProviderModule,
    DmnPropertiesPanelModule,
    DmnPropertiesProviderModule
} from "dmn-js-properties-panel";
import {useNavigate, useParams} from "react-router-dom";
import {getFormById} from "../service/formsService.jsx";
import {getDmnById, updateDmn} from "../service/dmnService.jsx";
const DmnEditorUpdate = () => {
    const navigate = useNavigate();
    const modelerRef = useRef(null);
    const containerRef = useRef(null); // Reference for the container where DMN modeler will be placed
    const propertiesPanelRef = useRef(null); // Reference for the properties panel container
    const { id } = useParams();
    const [diagram,setDiagram] = useState();

    useEffect( () => {

        const fetchFormData = async () => {
            try {
                const response = await getDmnById(id); // Assurez-vous que getFormById() retourne une promesse
                const dmnData = JSON.parse(response.dmnContent);
                setDiagram(dmnData);
                return response;
            } catch (err) {
                console.error("Erreur lors de la récupération des données du formulaire:", err);
            }
        };
        // Initialisation du modèle DMN uniquement une fois
        if (containerRef.current) {
            modelerRef.current = new DmnModeler({
                container: containerRef.current,
                drd:{
                    propertiesPanel: {
                        parent: propertiesPanelRef.current
                    },

                }
                ,
                additionalModules:[DmnPropertiesProviderModule,DmnPropertiesPanelModule,CamundaPropertiesProviderModule]
            });

            fetchFormData().then(r=>{
                modelerRef.current.importXML(JSON.parse(r.dmnContent)).then(() => {
                    console.log("Schema imported successfully");
                }).catch(err => {
                    console.error("Error importing schema", err);
                });
                });
        }

        // Nettoyage de l'instance lorsque le composant est démonté
        return () => {

                modelerRef.current.destroy();
        };
    }, [diagram]); // Assurez

    async function handleSave() {
        const {xml} = await modelerRef.current.saveXML({format: true});
        localStorage.setItem("dmnXml", JSON.stringify(xml));
        await updateDmn(id, JSON.stringify(xml));

    }

    function handleZoomReset() {
        var activeView = modelerRef.current.getActiveView();

        // apply initial logic in DRD view
        if (activeView.type === 'drd') {
            var activeEditor = modelerRef.current.getActiveViewer();

            // access active editor components
            var canvas = activeEditor.get('canvas');

            // zoom to fit full viewport
            canvas.zoom('fit-viewport');
        }
    }

    function handleZoomIn() {
        var activeView = modelerRef.current.getActiveView();

        // apply initial logic in DRD view
        if (activeView.type === 'drd') {
            var activeEditor = modelerRef.current.getActiveViewer();

            // access active editor components
            var canvas = activeEditor.get('canvas');

            // zoom to fit full viewport
            const currentZoom = canvas.zoom();
            canvas.zoom(currentZoom + 0.1);
        }
    }

    function handleZoomOut() {
        var activeView = modelerRef.current.getActiveView();

        // apply initial logic in DRD view
        if (activeView.type === 'drd') {
            var activeEditor = modelerRef.current.getActiveViewer();

            // access active editor components
            var canvas = activeEditor.get('canvas');

            // zoom to fit full viewport
            const currentZoom = canvas.zoom();
            canvas.zoom(currentZoom - 0.1);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh"}} className='relative h-sceen'>
            <div  style={{ display: "flex", flexDirection: "column"}} className="flex flex-column  mb-4 absolute bottom-1 left-3 z-10 ">
                <button
                     onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
                >
                    Enregistrer
                </button>
                <button
                    // onClick={handleValidate}
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
                            <button
                                onClick={handleZoomReset}
                            >
                                0
                            </button>
                        </li>
                        <li className="bg-gray-500  text-white   mb-2 text-center py-2 px-4">
                            <button
                                onClick={handleZoomIn}
                            >
                                +
                            </button>
                        </li>
                        <li className="bg-gray-500  text-white   mb-2 text-center py-2 px-4">
                            <button
                                onClick={handleZoomOut}
                            >
                                -
                            </button>
                        </li>
                    </ul>
                </div>
                <div  ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto"}} />
            </div>
        </div>
    );
};

export default DmnEditorUpdate;
