import {useEffect, useRef, useState} from "react";
// import {FormEditor} from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from '@bpmn-io/form-js-editor';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {createForm, getFormById, updateFormFile} from "../service/formsService.jsx";

const FormEditorUpdate = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const [formFileId, setFormFileId] = useState();
    const { id } = useParams();
    const [schema, setSchema] = useState();

    useEffect( () => {
        const fetchFormData = async () => {
            try {
                const response = await getFormById(id); // Assurez-vous que getFormById() retourne une promesse
                const formData = JSON.parse(response.formContent);
                setSchema(formData);
                return response;
            } catch (err) {
                console.error("Erreur lors de la récupération des données du formulaire:", err);
            }
        };
        if (containerRef.current && !formRef.current) {
            formRef.current = new FormEditor({
                container: containerRef.current,
            });
            fetchFormData().then(r=>{
                setFormFileId(r.id);
                formRef.current.importSchema(JSON.parse(r.formContent)).then(() => {
                    console.log("Schema imported successfully");
                }).catch(err => {
                    console.error("Error importing schema", err);
                });
                console.log(r)});




            console.log("FormEditor initialized", formRef.current);
        } else if (!containerRef.current) {
            console.error("Container reference is null");
        }
    }, [schema]);


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

        updateSchema(formFileId, JSON.stringify(currentSchema))

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

export default FormEditorUpdate;
