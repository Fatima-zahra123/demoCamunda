import  { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { format } from "date-fns";
import {deleteDmnFile, getDmnFiles} from "../service/dmnService.jsx";


const ListDMN = () => {
    const [dmnFiles, setDmnFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormFiles = async () => {
            try {
                const files = await getDmnFiles();
                setDmnFiles(files);
            } catch (error) {
                console.error('Error fetching dmn files:', error);
            }
        };

        fetchFormFiles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDmnFile(id);
            setDmnFiles(dmnFiles.filter(file => file.id !== id));
        } catch (error) {
            console.error('Error deleting BPMN file:', error);
        }
    };

    const handleEdit = (file) => {
        navigate(`/dmn-edit/${file.id}`);
    };

    function handleClick() {
        localStorage.clear();
    }





    function formatDate(dateArray) {
        if (!Array.isArray(dateArray) || dateArray.length < 6) return "Date invalide";

        const [year, month, day, hour, minute, second, nano] = dateArray;

        // Convertir les nanosecondes en millisecondes (en divisant par 1_000_000)
        const milliseconds = Math.floor(nano / 1_000_000);

        // Créer un objet Date (mois -1 car JavaScript commence à 0)
        const dateObject = new Date(year, month - 1, day, hour, minute, second, milliseconds);

        return isNaN(dateObject) ? "Date invalide" : format(dateObject, "dd/MM/yyyy HH:mm:ss");
    }


    return (
        <div className="p-4">
            <Link to="/create-dmn">
                <button onClick={handleClick} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-md mb-6">
                    Créer un nouveau dmn
                </button>
            </Link>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">dmns</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Version</th>
                            <th className="py-2 px-4 border-b">Updated At</th>
                            <th className="py-2 px-4 border-b">Created At</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dmnFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{file.id}</td>
                                <td className="py-2 px-4 border-b">{file.dmnName}</td>
                                <td className="py-2 px-4 border-b">{file.version}</td>
                                {/*<td className="py-2 px-4 border-b">{file.updatedAt}</td>*/}
                                {/*<td className="py-2 px-4 border-b">{file.createdAt}</td>*/}
                                <td className="py-2 px-4 border-b">{formatDate(file.updatedAt)}</td>
                                <td className="py-2 px-4 border-b">{formatDate(file.createdAt)}</td>
                                {/*<td className="py-2 px-4 border-b">{format(new Date(file.createdAt), "dd/MM/yyyy HH:mm:ss")}</td>*/}
                                <td className="py-2 px-4 border-b">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2" onClick={() => handleEdit(file)}>Edit</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded mr-2" onClick={() => handleDelete(file.id)}>Delete</button>
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

export default ListDMN;