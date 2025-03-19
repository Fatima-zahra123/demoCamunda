import { useEffect, useRef, useState} from 'react';
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
import magicModdleDescriptor from "../descriptors/magic.json";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import minimapModule from 'diagram-js-minimap';
import {useLocation} from "react-router-dom";
import {updateBpmnFileFromXml, getBpmnById, deploy} from "../service/bpmnService.jsx";
import FormPropertiesProvider from "../FormPropertiesProvider.js";
import {getFormsByCode} from "../service/formsService.jsx";


const CamundaEditorUpdate = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);

    const location = useLocation();
    const { id } = location.state || null;
    const [data,setData]=useState({})
    const [isValid,setIsValid]=useState(false);


    useEffect(()=>
    {

        const fetchBpmnById=async () => {
            try {
                const response = await getBpmnById(id); // Assurez-vous que getFormById() retourne une promesse
                return response;
            } catch (err) {
                console.error("Erreur lors de la récupération des données du formulaire:", err);
            }
        };

        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [{
                __init__: [ 'formPropertiesProvider'],
                formPropertiesProvider: [ 'type', FormPropertiesProvider ]
            },
                minimapModule,BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,CamundaPlatformTooltipProvider,camundaPlatformBehaviors],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor,
                magic: magicModdleDescriptor},
        });


        fetchBpmnById().then(async (response) => {
            getFormsByCode(response.codeProcess).then(r=>localStorage.setItem("Forms",JSON.stringify(r)));
            await modelerRef.current.importXML(response.content);
            setData(response)
        })

        return () => {
            modelerRef.current.destroy();
        };

    },[])



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
            console.log(data.id)
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const response = await updateBpmnFileFromXml(data.id,data.name,xml,isValid);
            console.log('BPMN File updated:', response,isValid);
            return response;
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
        setIsValid(true);

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
                {/*<button*/}
                {/*    onClick={()=>{navigate(-1);}}*/}
                {/*    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-2"*/}
                {/*>*/}
                {/*    Retour*/}
                {/*</button>*/}

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

export default CamundaEditorUpdate;