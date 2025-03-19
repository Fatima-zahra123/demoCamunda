// import {useEffect, useRef, useState} from "react";
// // import {FormEditor} from "@bpmn-io/form-js";
// import "@bpmn-io/form-js/dist/assets/form-js.css";
// import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
// import { FormEditor } from '@bpmn-io/form-js-editor';
// import {useLocation, useNavigate} from "react-router-dom";
// import {createForm, updateFormFile} from "../service/formsService.jsx";
// const FormEditorComponent = () => {
//     const containerRef = useRef(null);
//     const formRef = useRef(null);
//     const navigate = useNavigate(); // Ref to keep track of FormEditor instance
//     const  location=useLocation();
//     // const { info } = location.state || {};
//     const storedFormData = JSON.parse(localStorage.getItem("formDataForm")) || {};
//     const processName = storedFormData.process || "defaultName";
//     const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_'); // Nettoyer le nom
//     const [isCreated, setIsCreated] = useState(() => {
//         return JSON.parse(localStorage.getItem("isCreated")) || false;});
//     const [formFileId, setFormFileId] = useState(() => {
//         return JSON.parse(localStorage.getItem("formfileId")) || null;});
//     const [schema, setSchema] = useState(() => {
//     if
//         (localStorage.getItem("json"))
//     {
//       return JSON.parse(localStorage.getItem("json"))
//     }
//     else
//     {
//         return {
//             type: 'default',
//             components: [
//             ],
//             id: storedFormData.name
//         }
//     }
//
//
//     });
//
//     const [isValid, setisValid] = useState(false);
//
//     useEffect(() => {
//         if( JSON.parse(localStorage.getItem("json")))
//         {
//
//             setIsCreated(true);
//         }
//
//         if (containerRef.current && !formRef.current) {
//             formRef.current = new FormEditor({
//                 container: containerRef.current,
//             });
//
//             formRef.current.importSchema(schema).then(() => {
//                 console.log("Schema imported successfully");
//             }).catch(err => {
//                 console.error("Error importing schema", err);
//             });
//
//
//
//
//
//             // console.log("FormEditor initialized", formRef.current);
//         } else if (!containerRef.current) {
//             console.error("Container reference is null");
//         }
//     }, []);
//
//     const saveSchema = async (formId,formContent) => {
//         try {
//
//             const response = createForm(formId,formContent,storedFormData.code);
//                 response.then(r=>{
//                     setFormFileId(r.id)
//                     localStorage.setItem("formfileId",r.id)
//                     console.log('r',r.id)
//                 })
//
//         } catch (error) {
//             console.error("Erreur lors de l'enregistrement", error);
//         }
//     };
//
//     function updateSchema(id, s) {
//         try {
//             const response = updateFormFile(id,s)
//             console.log("update",response)
//         }
//         catch (error)
//         {
//            console.log(error)
//         }
//
//     }
//
//     const saveForm =  () => {
//         const currentSchema = formRef.current.saveSchema();
//         localStorage.setItem("json",JSON.stringify(currentSchema))
//         if (!isCreated) {
//             setIsCreated(true)
//             saveSchema(currentSchema.id, JSON.stringify(currentSchema));
//         } else {
//
//             updateSchema(JSON.parse(localStorage.getItem("formfileId")), JSON.stringify(currentSchema))
//         }
//
//     }
//
//
//     function handleValid() {
//         setisValid(true);
//     }
//
//     return (
//         <div className="bg-white relative">
//             <div  style={{ display: "flex", flexDirection: "column"}} className="flex flex-column  mb-4 absolute bottom-1 right-3 z-10 ">
//                 <button
//                     onClick={saveForm}
//                     className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
//                 >
//                     Enregistrer
//                 </button>
//                 <button
//                     onClick={handleValid}
//                     className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-2"
//                 >
//                     Valider
//                 </button>
//                 <button
//                     onClick={()=>{navigate(-1);}}
//                     className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-2"
//                 >
//                     Retour
//                 </button>
//
//             </div>
//
//             <div
//                 ref={containerRef}
//                 className="border border-gray-300    h-screen"
//
//             />
//         </div>
//     );
// };
//
// export default FormEditorComponent;
//
// import { useEffect, useRef, useState, useCallback } from "react";
// import "@bpmn-io/form-js/dist/assets/form-js.css";
// import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
// import { FormEditor } from "@bpmn-io/form-js-editor";
// import { useLocation, useNavigate } from "react-router-dom";
// import {createForm, deploy, updateFormFile} from "../service/formsService.jsx";
//
// const FormEditorComponent = () => {
//     const containerRef = useRef(null);
//     const formRef = useRef(null);
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     const storedFormData = JSON.parse(localStorage.getItem("formDataForm")) || {};
//     const processName = storedFormData.process || "defaultName";
//     const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_');
//
//     const [isCreated, setIsCreated] = useState(() => JSON.parse(localStorage.getItem("isCreated")) || false);
//     const [formFileId, setFormFileId] = useState(() => JSON.parse(localStorage.getItem("formfileId")) || null);
//     const [isValid, setIsValid] = useState(false);
//
//     const [schema, setSchema] = useState(() => {
//         return JSON.parse(localStorage.getItem("json")) || {
//             type: "default",
//             components: [],
//             id: storedFormData.name
//         };
//     });
//
//     useEffect(() => {
//         if (!containerRef.current || formRef.current) return;
//
//         formRef.current = new FormEditor({ container: containerRef.current });
//         formRef.current.importSchema(schema).catch(err => console.error("Error importing schema", err));
//     }, [schema]);
//
//     useEffect(() => {
//         if (isValid) {
//             // console.log(isValid)
//              saveForm().then((r)=>{
//                  console.log(r)
//                  deploy(r.formId, r.formContent).then(r => console.log(r)).catch(err=>console.log(err));
//              });
//         }
//
//     }, [isValid]);
//
//     const saveSchema = useCallback(async (formId, formContent) => {
//         try {
//             const response = await createForm(formId, formContent, storedFormData.code);
//             setFormFileId(response.id);
//             localStorage.setItem("formfileId", JSON.stringify(response.id));
//         } catch (error) {
//             console.error("Error saving schema", error);
//         }
//     }, [storedFormData.code]);
//
//     const updateSchema = useCallback(async (id, formContent) => {
//         try {
//           const response=  await updateFormFile(id, formContent);
//           return response;
//         } catch (error) {
//             console.error("Error updating schema", error);
//         }
//     }, []);
//
//     const saveForm = useCallback(async () => {
//         if (!formRef.current) return;
//
//         const currentSchema = formRef.current.saveSchema();
//         localStorage.setItem("json", JSON.stringify(currentSchema));
//
//         if (!isCreated) {
//             setIsCreated(true);
//             localStorage.setItem("isCreated",JSON.stringify(true))
//             await saveSchema(currentSchema.id, JSON.stringify(currentSchema));
//         } else {
//             await updateSchema(formFileId, JSON.stringify(currentSchema));
//         }
//     }, [isCreated, saveSchema, updateSchema, formFileId]);
//
//     const validateForm = useCallback(async () => {
//         setIsValid(true);
//
//     }, [saveForm]);
//
//     return (
//         <div className="bg-white relative h-screen">
//             <div className="absolute bottom-1 right-3 z-10 flex flex-col space-y-2">
//                 <button onClick={saveForm} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Enregistrer</button>
//                 <button onClick={validateForm} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Valider</button>
//                 <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">Retour</button>
//             </div>
//             <div ref={containerRef} className="border border-gray-300 h-full" />
//         </div>
//     );
// };
//
// export default FormEditorComponent;

import { useEffect, useRef, useState, useCallback } from "react";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";
import { FormEditor } from "@bpmn-io/form-js-editor";
import { useLocation, useNavigate } from "react-router-dom";
import { createForm, deploy, updateFormFile } from "../service/formsService.jsx";

const FormEditorComponent = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const storedFormData = JSON.parse(localStorage.getItem("formDataForm")) || {};
    const processName = storedFormData.process || "defaultName";
    const sanitizedProcessName = processName.replace(/[^a-zA-Z0-9._-]/g, '_');

    const [isCreated, setIsCreated] = useState(() => JSON.parse(localStorage.getItem("isCreated")) || false);
    const [formFileId, setFormFileId] = useState(() => JSON.parse(localStorage.getItem("formfileId")) || null);
    const [isValid, setIsValid] = useState(false);

    const [schema, setSchema] = useState(() => {
        return JSON.parse(localStorage.getItem("json")) || {
            type: "default",
            components: [],
            id: storedFormData.name,
        };
    });

    useEffect(() => {
        if (containerRef.current && !formRef.current) {
            formRef.current = new FormEditor({
                container: containerRef.current,
            });

            formRef.current.importSchema(schema).catch(err => console.error("Error importing schema", err));
        }
    }, [schema]);

    const saveSchema = useCallback(async (formId, formContent) => {
        try {
            const response = await createForm(formId, formContent, storedFormData.code);
            setFormFileId(response.id);
            localStorage.setItem("formfileId", JSON.stringify(response.id));
            return response;
        } catch (error) {
            console.error("Error saving schema", error);
        }
    }, [storedFormData.code]);

    const updateSchema = useCallback(async (id, formContent) => {
        try {
            const response = await updateFormFile(id, formContent);
            // console.log(response)
            return response;
        } catch (error) {
            console.error("Error updating schema", error);
        }
    }, []);

    const saveForm = useCallback(async () => {
        if (!formRef.current) return;

        const currentSchema = formRef.current.saveSchema();
        localStorage.setItem("json", JSON.stringify(currentSchema));

        if (!isCreated) {
            setIsCreated(true);
            localStorage.setItem("isCreated", JSON.stringify(true));
          return  await saveSchema(currentSchema.id, JSON.stringify(currentSchema));
        } else {
          return  await updateSchema(formFileId, JSON.stringify(currentSchema));
        }
    }, [isCreated, formFileId, saveSchema, updateSchema]);

    const validateForm = useCallback(async () => {
        setIsValid(true);
    }, []);

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

    return (
        <div className="bg-white relative h-screen">
            <div className="absolute bottom-1 right-3 z-10 flex flex-col space-y-2">
                <button onClick={saveForm} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Enregistrer
                </button>
                <button onClick={validateForm} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                    Valider
                </button>
                <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                    Retour
                </button>
            </div>
            <div ref={containerRef} className="border border-gray-300 h-full" />
        </div>
    );
};

export default FormEditorComponent;
