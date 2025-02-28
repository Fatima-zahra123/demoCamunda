import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ListBpmnFiles from "./ListBpmnFiles";
import BpmnEditorForm from "./BpmnEditorForm";
import BPMNEditorWithSB from "./BPMNEditorWithSB";
import CamundaEditor from "./camundaEditor.jsx";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-md flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Modélisation des processus</h1>
                    <nav>
                        <Link to="/" className="text-white text-lg hover:underline">
                            Accueil
                        </Link>
                    </nav>
                </header>
                <div className="container mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/create" element={<BpmnEditorForm />} />
                        <Route path="/bpmn-editor-with-sb" element={<BPMNEditorWithSB />} />
                        <Route path="/camunda" element={<CamundaEditor />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function MainPage() {
    return (
        <>
            <Link to="/create">
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md mb-6">
                    Créer un nouveau processus
                </button>
            </Link>
            <ListBpmnFiles />
        </>
    );
}

export default App;