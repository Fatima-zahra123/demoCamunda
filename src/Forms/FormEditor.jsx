import {useEffect, useRef, useState} from "react";
// import {FormEditor} from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from '@bpmn-io/form-js-editor';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const FormEditorComponent = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate(); // Ref to keep track of FormEditor instance
    const [schema, setSchema] = useState({
        type: 'default',
        components: [
        ],
    });

    useEffect(() => {
        if (containerRef.current && !formRef.current) {
            formRef.current = new FormEditor({
                container: containerRef.current,
            });

            formRef.current.importSchema(schema).then(() => {
                console.log("Schema imported successfully");
            }).catch(err => {
                console.error("Error importing schema", err);
            });


            console.log("FormEditor initialized", formRef.current);
        } else if (!containerRef.current) {
            console.error("Container reference is null");
        }
    }, []);

    const saveSchema = async (json) => {
        try {
            await axios.post("http://localhost:5000/save-schema", {json});
            alert("BPMN enregistré !");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };
    const saveForm =  () => {
        try {
            const currentSchema = formRef.current.saveSchema();
            setSchema(currentSchema);
            // saveSchema(currentSchema);
            console.log("Schema exported successfully", currentSchema);
            navigate("/form-viewer", {state: {schema: currentSchema}});
        } catch (err) {
            console.error("Error exporting schema", err);
        }
    };


    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={saveForm}
            >
                💾 Sauvegarder
            </button>

            <div
                ref={containerRef}
                className="border border-gray-300 mt-4  rounded-md min-h-[300px]"

            />
        </div>
    );
};

export default FormEditorComponent;
