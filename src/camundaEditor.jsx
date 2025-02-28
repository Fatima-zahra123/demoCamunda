import React, { useEffect, useRef } from 'react';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule, CamundaPlatformTooltipProvider
} from "bpmn-js-properties-panel";
import magicModdleDescriptor from "./descriptors/magic.json";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import minimapModule from 'diagram-js-minimap';

const CamundaEditor = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);

    useEffect(() => {
        modelerRef.current = new BpmnModeler({
            container: containerRef.current,
            additionalModules: [minimapModule,BpmnPropertiesPanelModule, BpmnPropertiesProviderModule,CamundaPlatformPropertiesProviderModule,CamundaPlatformTooltipProvider],
            propertiesPanel: { parent: propertiesPanelRef.current },
            moddleExtensions: { camunda: camundaModdleDescriptor,
                magic: magicModdleDescriptor},
        });

        const setTTL = () => {
            const elementRegistry = modelerRef.current.get('elementRegistry');
            const modeling = modelerRef.current.get('modeling');
            const processElement = elementRegistry.get('Process_1'); // Adjust the ID as needed
            if (processElement) {
                modeling.updateProperties(processElement, {
                    'camunda:historyTimeToLive': 180,
                    'isExecutable': true
                });
            }
        };
        const createDiagram = async () => {
            try {
                await modelerRef.current.createDiagram();
                setTTL();
            } catch (err) {
                console.error('Error creating diagram', err);
            }
        };

        createDiagram();

        return () => {
            modelerRef.current.destroy();
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "600px" }}>
            <button

                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 self-end"
            >
                Enregistrer
            </button>
            <div style={{ display: "flex", flex: 1 }}>
                <div ref={containerRef} style={{ flex: 3, border: "1px solid #ccc" }} />
                <div ref={propertiesPanelRef} style={{ flex: 1, border: "1px solid #ccc", padding: "0px", overflow: "auto" }} />
            </div>
        </div>
    );
};

export default CamundaEditor;