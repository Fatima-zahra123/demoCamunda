import { useEffect, useRef } from "react";
// import {FormEditor} from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from '@bpmn-io/form-js-editor';

const FormsEditor = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null); // Ref to keep track of FormEditor instance
    const schema = {
        type: 'default',
        components: [
            {
                key: 'creditor',
                label: 'Creditor',
                type: 'textfield',
                validate: {
                    required: true,
                },
            },
        ],
    };

    useEffect(() => {

            formRef.current = new FormEditor({
                container: containerRef.current,
            });

            formRef.current.importSchema(schema).then(() => {
                console.log("Schema imported successfully");
            }).catch(err => {
                console.error("Error importing schema", err);
            });


            console.log("FormEditor initialized", formRef.current);

    }, []);


    const saveForm = () => {
        try {
            const currentSchema = formRef.current.saveSchema();

            console.log("Schema exported successfully", currentSchema);
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

export default FormsEditor;
