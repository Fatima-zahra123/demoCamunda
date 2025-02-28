import { useState, useEffect } from "react";
import BpmnEditor from "./BpmnEditor";
import axios from "axios";
import BpmnEditor1 from "./BpmnEditorwithNodeServer.jsx";
import BpmnEditorSB from "./BpmnEditorwithSB.jsx";
import ListBpmnFiles from "./ListBpmnFiles.jsx";

function App() {
    const [bpmnXml, setBpmnXml] = useState("");

    // Charger le BPMN au démarrage
    useEffect(() => {
        axios
            .get("http://localhost:5000/bpmn")
            .then((response) => setBpmnXml(response.data))
            .catch((err) => console.error("Erreur de chargement du BPMN", err));
    }, []);

    // Sauvegarde du fichier BPMN
    const saveBpmn = async (xml) => {
        try {
            await axios.post("http://localhost:5000/save-bpmn", { xml });
            alert("BPMN enregistré !");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };

    return (
        <div>
            <h1>Éditeur BPMN avec Properties Panel</h1>
            {/*<BpmnEditor1 xml={bpmnXml} onSave={saveBpmn} />*/}
            <BpmnEditorSB xml={bpmnXml} onSave={saveBpmn}/>
        </div>
    );
}

export default App;
