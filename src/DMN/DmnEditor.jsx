import {useEffect, useRef, useState} from "react";


import { CamundaPlatformModeler as DmnModeler } from 'camunda-dmn-js';
import './style.css'
import 'camunda-dmn-js/dist/assets/camunda-platform-modeler.css';
import {
    CamundaPropertiesProviderModule,
    DmnPropertiesPanelModule,
    DmnPropertiesProviderModule
} from "dmn-js-properties-panel";
import {useNavigate} from "react-router-dom";
import {createDmn, updateDmn} from "../service/dmnService.jsx";

const DmnEditor = () => {
    const navigate = useNavigate();
    const modelerRef = useRef(null);
    const containerRef = useRef(null); // Reference for the container where DMN modeler will be placed
    const propertiesPanelRef = useRef(null); // Reference for the properties panel container
    const storedFormData = JSON.parse(localStorage.getItem("formDataForm")) || {};
    const processedId= "DMN_"+storedFormData.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const [diagram,setDiagram] = useState(()=>{
            if(JSON.parse(localStorage.getItem("dmnXml"))){
                return JSON.parse(localStorage.getItem("dmnXml"));
            }
            else{
                return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="${processedId}" name="${storedFormData.name}" namespace="http://camunda.org/schema/1.0/dmn">

</definitions>
`
//         return `<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0oqlmkc" name="DRD" namespace="http://camunda.org/schema/1.0/dmn" exporter="Camunda Modeler" exporterVersion="5.31.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.22.0"><dmndi:DMNDI><dmndi:DMNDiagram /></dmndi:DMNDI></definitions>`    ;


            }
    }
        );

    const [id,setId]=useState(()=>{
      return JSON.parse( localStorage.getItem("dmnId"));
    })

    useEffect( () => {


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


            try {
                modelerRef.current.importXML(diagram);
                console.log("DMN Diagram loaded successfully!");
            } catch (err) {
                console.error("Error loading DMN Diagram:", err);
            }
        }

        // Nettoyage de l'instance lorsque le composant est démonté
        return () => {

                modelerRef.current.destroy();
        };
    }, []); // Assurez

    async function handleSave() {
        try {
            const {xml} = await modelerRef.current.saveXML({format: true});
            if(!JSON.parse(localStorage.getItem("dmnXml")))
            {
                const response=await createDmn(processedId, storedFormData.name, xml, storedFormData.code);
                localStorage.setItem("dmnId", JSON.stringify(response.id));
                setId(response.id)
                setDiagram(xml)
                localStorage.setItem("dmnXml", JSON.stringify(xml));
            }
            else {
                localStorage.setItem("dmnXml", JSON.stringify(xml));
                await updateDmn(id,xml)
            }

        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }

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
                <div id="propertiesPanel" ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto"}} />
            </div>
        </div>
    );
};

export default DmnEditor;
