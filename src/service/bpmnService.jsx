import axios from "axios";

const API_URL = 'http://localhost:8092/api/bpmn-files';

const createBpmnFileFromXml = async (name, description, xmlContent) => {
    const response = await axios.post(`${API_URL}/create2`, null, {
        params: { name, description, xmlContent }
    });
    return response.data;
};

const getBpmnFiles = async () => {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
}
export {
    createBpmnFileFromXml,
    getBpmnFiles
};