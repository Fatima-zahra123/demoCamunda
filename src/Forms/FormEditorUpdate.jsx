import {useEffect, useRef, useState} from "react";
// import {FormEditor} from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from '@bpmn-io/form-js-editor';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {createForm, deploy, getFormById, updateFormFile} from "../service/formsService.jsx";

const FormEditorUpdate = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const [formFileId, setFormFileId] = useState();
    const { id } = useParams();
    const [schema, setSchema] = useState();
    const navigate=useNavigate();
    const [isValid, setIsValid] = useState(false);

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
            return response;
        }
        catch (error)
        {
           console.log(error)
        }

    }

    const saveForm =  async () => {
        const currentSchema = formRef.current.saveSchema();
        localStorage.setItem("json", JSON.stringify(currentSchema))

        return updateSchema(formFileId, JSON.stringify(currentSchema));

    }

    useEffect(() => {
        if (isValid) {
            saveForm().then((r) => {
                console.log(r.formContent);
                deploy(r.formId, r.formContent)
                    .then((r) => console.log(r))
                    .catch((err) => console.log(err));
            });
        }
    }, [isValid]);


    const handleValidate = async () => {
        setIsValid(true);

    };

    return (
        <div className="bg-white relative">
            <div  style={{ display: "flex", flexDirection: "column"}} className="flex flex-column  mb-4 absolute bottom-1 right-3 z-10 ">
                <button
                    onClick={saveForm}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
                >
                    Enregistrer
                </button>
                <button
                    onClick={handleValidate}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-2"
                >
                    Valider
                </button>
                <button
                    onClick={()=>{navigate(-1);}}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-2"
                >
                    Retour
                </button>

            </div>


            <div
                ref={containerRef}
                className="border border-gray-300    h-screen"

            />
        </div>
    );
};

export default FormEditorUpdate;
