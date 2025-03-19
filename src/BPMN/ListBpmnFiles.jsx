import React, { useEffect, useState } from 'react';
import {getBpmnFiles, deleteBpmnFile, deploy} from '../service/bpmnService.jsx';
import {Link, useNavigate} from "react-router-dom";



const ListBpmnFiles = () => {
    const [bpmnFiles, setBpmnFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBpmnFiles = async () => {
            try {
                const files = await getBpmnFiles();
                setBpmnFiles(files);
            } catch (error) {
                console.error('Error fetching BPMN files:', error);
            }
        };

        fetchBpmnFiles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteBpmnFile(id);
            setBpmnFiles(bpmnFiles.filter(file => file.id !== id));
        } catch (error) {
            console.error('Error deleting BPMN file:', error);
        }
    };

    const handleEdit = (file) => {
        navigate('/bpmn-edit', { state: { id: file.id } });
    };

    function handleClick() {
        localStorage.clear();
    }

    function handleDeploy(id) {

            deploy(id).then(r => console.log("deployed successfully",r)).catch(err=>console.log(err));
    }

    return (
        <div className="p-4">
            <Link to="/create-bpmn">
                <button onClick={handleClick} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md mb-6">
                    Créer un nouveau processus
                </button>
            </Link>

        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">BPMN Files</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Version</th>
                        <th className="py-2 px-4 border-b">Updated At</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bpmnFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{file.id}</td>
                            <td className="py-2 px-4 border-b">{file.name}</td>
                            <td className="py-2 px-4 border-b">{file.description}</td>
                            <td className="py-2 px-4 border-b">{file.version}</td>
                            <td className="py-2 px-4 border-b">{new Date(file.updatedAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{new Date(file.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2" onClick={() => handleEdit(file)}>Edit</button>
                                <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" onClick={() => handleDelete(file.id)}>Delete</button>
                                <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded" onClick={() => handleDeploy(file.id)}>Deploy</button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default ListBpmnFiles;