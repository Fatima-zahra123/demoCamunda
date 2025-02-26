import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';


const BpmnEditor = ({ xml, onSave }) => {
    const containerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const modelerRef = useRef(null);

    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor },
        });

        if (xml) {
            modelerRef.current.importXML(xml).catch((err) => console.error("Erreur d'import BPMN", err));
        }

        return () => modelerRef.current.destroy();
    }, [xml]);

    // Fonction pour sauvegarder le fichier
    const handleSave = async () => {
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            onSave(xml);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };

    return (
        <div style={{ display: "flex", height: "600px" }}>
            {/* Zone du diagramme BPMN */}
            <div ref={containerRef} style={{ flex: 3, border: "1px solid #ccc" }} />

            {/* Panneau de propriétés */}
            <div ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto" }} />

            {/* Bouton d'enregistrement */}
            <button onClick={handleSave} style={{ position: "absolute", bottom: 10, right: 10 }}>
                Enregistrer
            </button>
        </div>
    );
};

export default BpmnEditor;
