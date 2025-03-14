import {useEffect, useRef, useState} from "react";
// import {FormEditor} from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from '@bpmn-io/form-js-editor';
import {useLocation, useNavigate} from "react-router-dom";
import {createForm, updateFormFile} from "../service/formsService.jsx";
const FormEditorComponent = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate(); // Ref to keep track of FormEditor instance
    const  location=useLocation();
    // const { info } = location.state || {};
    const storedFormData = JSON.parse(localStorage.getItem("formDataForm")) || {};
    const processName = storedFormData.process || "defaultName";
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Nettoyer le nom
    const [isCreated, setIsCreated] = useState(() => {
        return JSON.parse(localStorage.getItem("isCreated")) || false;});
    const [formFileId, setFormFileId] = useState(() => {
        return JSON.parse(localStorage.getItem("formfileId")) || null;});
    const [schema, setSchema] = useState(() => {
    if(localStorage.getItem("json"))
    {
      return JSON.parse(localStorage.getItem("json"))
    }
    else
    {
        return {
            type: 'default',
            components: [
            ],
            id: storedFormData.name
        }
    }


    });


    useEffect(() => {
        if( JSON.parse(localStorage.getItem("json")))
        {

            setIsCreated(true);
        }

        if (containerRef.current && !formRef.current) {
            formRef.current = new FormEditor({
                container: containerRef.current,
            });

            formRef.current.importSchema(schema).then(() => {
                console.log("Schema imported successfully");
            }).catch(err => {
                console.error("Error importing schema", err);
            });





            // console.log("FormEditor initialized", formRef.current);
        } else if (!containerRef.current) {
            console.error("Container reference is null");
        }
    }, []);

    const saveSchema = async (formId,formContent) => {
        try {

            const response = createForm(formId,formContent,storedFormData.code);
                response.then(r=>{
                    setFormFileId(r.id)
                    localStorage.setItem("formfileId",r.id)
                    console.log('r',r.id)
                })

        } catch (error) {
            console.error("Erreur lors de l'enregistrement", error);
        }
    };

    function updateSchema(id, s) {
        try {
            const response = updateFormFile(id,s)
            console.log("update",response)
        }
        catch (error)
        {
           console.log(error)
        }

    }

    const saveForm =  () => {
        const currentSchema = formRef.current.saveSchema();
        localStorage.setItem("json",JSON.stringify(currentSchema))
        if (!isCreated) {
            setIsCreated(true)
            saveSchema(currentSchema.id, JSON.stringify(currentSchema));
        } else {

            updateSchema(JSON.parse(localStorage.getItem("formfileId")), JSON.stringify(currentSchema))
        }

    }



    return (
        <div className="bg-white relative">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition absolute bottom-10 right-10 z-10"
                onClick={saveForm}
            >
                💾 Sauvegarder
            </button>

            <div
                ref={containerRef}
                className="border border-gray-300    h-screen"

            />
        </div>
    );
};

export default FormEditorComponent;
