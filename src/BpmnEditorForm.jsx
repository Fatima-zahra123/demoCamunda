import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BpmnEditorForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const info ={
        name: name,
        description: description
    };

    const handleNext = () => {
        const info = { name, description };
        navigate('/bpmn-editor-with-sb', { state: { info } });
    };
    return (
      <>
        <form  className="bg-white p-6 shadow-md rounded-lg">
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