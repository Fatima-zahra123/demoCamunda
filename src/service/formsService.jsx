import axios from "axios";

const API_FORMS_URL="http://localhost:8092/api/form-files"

const createForm = async (formId, formContent,codeProcess) => {
    const response = await axios.post(`${API_FORMS_URL}/create`,{
                formId:formId,
                formContent:formContent,
                codeProcess:codeProcess
    });
    return response.data;
};


const getFormFiles = async () => {
    const response = await axios.get(`${API_FORMS_URL}/list`);
    return response.data;
}

const updateFormFile = async (id,formContent) => {
    const response = await axios.put(`${API_FORMS_URL}/update/${id}`, {
        formContent :formContent
    });
    return response.data;
}

const deleteFormFile = async (id) => {
    await axios.delete(`${API_FORMS_URL}/delete/${id}`);
}

const getFormById = async (id) => {
    const response = await axios.get(`${API_FORMS_URL}/getform/${id}`);
    return response.data;
}

const deploy=async (formId) => {
    const response = await axios.post(`${API_FORMS_URL}/deploy/${formId}`, {


    });
    return response.data;
}

const getFormsByCode = async (code) => {
    const response = await axios.get(`${API_FORMS_URL}/getByCode/${code}`);
    return response.data;
}

export {
    createForm,
    getFormFiles,
    deleteFormFile,
    updateFormFile,
    getFormById,
    deploy,
    getFormsByCode
}