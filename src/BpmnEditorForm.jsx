import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BpmnEditorForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const options = [
        { code: 'DMH_1', nomProcess: "Octroi de l’autorisation d’exploration" },
        { code: 'DMH_2', nomProcess: "Renouvellement de l’autorisation d’exploration" },
        { code: 'DMH_3', nomProcess: "Octroi d'un permis de recherche"},
        // Ajoutez d'autres objets ici
    ];
    const info ={
        name: name,
        description: description,
        code:code

    };

    const handleNext = () => {
        console.log('Objet:', info);
        navigate('/camunda', { state: { info } });
    };
    return (
      <>
        <form  className="bg-white p-6 shadow-md rounded-lg">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nom du processus
                </label>
                <select
                    id="name"
                    value={name}
                    onChange={(e) => {
                        const selectedOption = options.find(option => option.nomProcess === e.target.value);
                        setName(e.target.value);
                        setCode(selectedOption.code);

                    }}
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
                    Nom du processus
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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