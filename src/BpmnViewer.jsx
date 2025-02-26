import { useEffect, useRef } from "react";
import BpmnJS from "bpmn-js";

const BpmnViewer = ({ xml }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const bpmnViewer = new BpmnJS({ container: containerRef.current });

        if (xml) {
            bpmnViewer.importXML(xml).catch(err => console.error("Erreur d'import BPMN", err));
        }

        return () => bpmnViewer.destroy();
    }, [xml]);

    return <div ref={containerRef} style={{ width: "100%", height: "500px", border: "1px solid #ccc" }} />;
};

export default BpmnViewer;
