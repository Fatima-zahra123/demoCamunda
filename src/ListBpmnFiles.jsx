import React, { useEffect, useState } from 'react';
import { getBpmnFiles } from './service/bpmnService';

const ListBpmnFiles = () => {
    const [bpmnFiles, setBpmnFiles] = useState([]);

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">BPMN Files</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Version</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {bpmnFiles.map((file) => (
                        <tr key={file.id}>
                            <td className="py-2 px-4 border-b">{file.id}</td>
                            <td className="py-2 px-4 border-b">{file.name}</td>
                            <td className="py-2 px-4 border-b">{file.description}</td>
                            <td className="py-2 px-4 border-b">{file.version}</td>
                            <td className="py-2 px-4 border-b">{new Date(file.updatedAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{new Date(file.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListBpmnFiles;