import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const BpmnEditorForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        return JSON.parse(localStorage.getItem("formData")) || {
            name: "",
            description: "",
            process: "",
            code: ""
        };
    });

    const options = [
        { code: 'DMH_1', nomProcess: "Octroi de l’autorisation d’exploration" },
        { code: 'DMH_2', nomProcess: "Renouvellement de l’autorisation d’exploration" },
        { code: 'DMH_3', nomProcess: "Octroi d'un permis de recherche"},
        // Ajoutez d'autres objets ici
    ];
    useEffect(() => {
        // Vérifier si des données existent déjà dans localStorage et les charger dans le formulaire
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
        console.log(JSON.parse(localStorage.getItem('formData')))

    }, [formData]);

    const handleInputChange = async (e) => {
        const {name, value} = e.target;
        if (name === "process") {
            const selectedOption = options.find(option => option.nomProcess === e.target.value);

            await axios.post("http://localhost:8092/api/bpmn-files/check-file-name", {
                fileName: value
            }).then((response) => {
                setFormData({
                    ...formData,
                    [name]: value,
                    name: response.data,
                    code: selectedOption.code
                });
            }).catch((error) => {
                console.log(error);
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    };


    const handleNext = () => {

        localStorage.setItem('info', JSON.stringify(formData));
        navigate('/camunda-editor');
    };

    const handleOnchage = (e) => {
                        console.log('selectedOption:', e.target.value);
        const selectedOption = options.find(option => option.nomProcess === e.target.value);
        const { name, value } = e.target;
        console.log(e.target)
        setFormData({
            ...formData,
            [name]:value
        });

        console.log(formData)
        axios.post("http://localhost:8092/api/bpmn-files/check-file-name",{
            fileName: e.target.value
        }).then((response) => {
            setFormData({
                ...formData,
                name: response.data
            });
        }).catch((error) => {
            console.log(error);
        });


    }
    return (
      <>
        <form  className="bg-white p-6 shadow-md rounded-lg">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="process">
                    processus concerné
                </label>
                <select
                    id="process"
                    name="process"
                    value={formData.process}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option value="">Sélectionnez un processus</option>
                    {options.map((option) => (
                        <option key={option.code} value={option.nomProcess}>
                            {option.nomProcess}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nom du fichier bpmn
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="flex space-x-4">
                <button type="button" onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Suivant
                </button>
                <button type="button" onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                    Retour
                </button>
            </div>
        </form></>
    );
};

export default BpmnEditorForm;