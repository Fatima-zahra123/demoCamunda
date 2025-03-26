import axios from "axios";



const API_URL = 'http://localhost:8092/api/bpmn-files';

const createBpmnFileFromXml = async (name, description, xmlContent,codeProcess,versionIsValid) => {
    const response = await axios.post(`${API_URL}/create`, null, {
        params: { name, description, xmlContent,codeProcess,versionIsValid }
    });
    return response.data;
};

const getBpmnFiles = async () => {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
}

const updateBpmnFileFromXml = async (id,xmlContent,versionIsValid) => {
    const response = await axios.put(`${API_URL}/update/${id}`, null, {
        params: { xmlContent ,versionIsValid}
    });
    return response.data;
}

const deleteBpmnFile = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`);
}

const getBpmnById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

const deploy=async (id) => {
    const response = await axios.post(`${API_URL}/deploy-bpmn`, null,{
params:{
    id:id
}
    });
    return response.data;
}

// const deploy=async (id) => {
//     const response = await axios.post(`${API_URL}/deploy/${id}`, {
//
//     });
//     return response.data;
// }

export {
    createBpmnFileFromXml,
    getBpmnFiles,
    deleteBpmnFile,
    updateBpmnFileFromXml,
    getBpmnById,
    deploy
};