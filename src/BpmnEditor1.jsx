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
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import {DebounceInputModule, FeelPopupModule} from "@bpmn-io/properties-panel";
import DistributeElementsMenuProvider from "bpmn-js/lib/features/distribute-elements/DistributeElementsMenuProvider.js";
import BpmnSearchProvider from "bpmn-js/lib/features/search/BpmnSearchProvider.js";
import BpmnAutoResizeProvider from "bpmn-js/lib/features/auto-resize/BpmnAutoResizeProvider.js";
import magicModdleDescriptor from './descriptors/magic';
import magicPropertiesProviderModule from './';
import formPropertiesProviderModule from './';
import CustomCamundaPropertiesProvider from "./CustomCamundaPropertiesModeler.js";




const BpmnEditor = ({ xml, onSave }) => {
    const containerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const modelerRef = useRef(null);

    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,FeelPopupModule,DebounceInputModule,DistributeElementsMenuProvider,BpmnSearchProvider,BpmnAutoResizeProvider,magicPropertiesProviderModule,formPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,{
                __init__: ['customPropertiesProvider'],
                customPropertiesProvider: ['type',  CustomCamundaPropertiesProvider]
            }],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor,
                magic: magicModdleDescriptor},
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
