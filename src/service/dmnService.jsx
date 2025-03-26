import axios from "axios";

const API_DMNS_URL="http://localhost:8092/api/dmn"

const getDmnFiles = async () => {
    const response = await axios.get(`${API_DMNS_URL}/list`);
    return response.data;
}

const deleteDmnFile = async (id) => {
    await axios.delete(`${API_DMNS_URL}/delete/${id}`);
}

const getDmnById = async (id) => {
    const response = await axios.get(`${API_DMNS_URL}/getDmn/${id}`);
    return response.data;
}

const createDmn = async (dmnId,dmnName,dmnContent,codeProcess) => {
    const response = await axios.post(`${API_DMNS_URL}/create`,{
        dmnId:dmnId,
        dmnName:dmnName,
        dmnContent:dmnContent,
        codeProcess:codeProcess
    });
    return response.data;
};

const updateDmn = async (id,dmnContent) => {
    const response = await axios.put(`${API_DMNS_URL}/update/${id}`,{

        dmnContent:dmnContent,

    });
    return response.data;
};


// const deploy=async (dmnId,dmnContent) => {
//     const response = await axios.post(`${API_DMNS_URL}/deploy`, {
//        dmnId: dmnId,
//         dmnContent: dmnContent
//
//
//     });
//     return response.data;
// }

const deploy=async (id) => {
    const response = await axios.post(`${API_DMNS_URL}/deploy-dmn`, null,{
        params:{
            id:id
        }
    });
    return response.data;
}
export {
   getDmnFiles,
    deleteDmnFile,
    getDmnById,
    createDmn,
    updateDmn,
    deploy
}