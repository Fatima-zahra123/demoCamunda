import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";




const BpmnEditor = ({ xml, onSave }) => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);

    useEffect(() => {
        modelerRef.current = new BpmnModeler({ container: containerRef.current });

        if (xml) {
            modelerRef.current.importXML(xml).catch(err => console.error("Erreur d'import BPMN", err));
        }

        return () => modelerRef.current.destroy();
    }, [xml]);

    const handleSave = async () => {
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            console.log("XML enregistré", xml);
            onSave(xml);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };

    return (
        <div>
            <div ref={containerRef} style={{ width: "100%", height: "500px", border: "1px solid #ccc" }} />
            <button onClick={handleSave}>Enregistrer</button>
        </div>
    );
};

export default BpmnEditor;
