import axios from 'axios';

const baseUrl = 'http://192.168.1.141:5001/api';

export const auth = (data) => {
    let url = baseUrl + '/auth';
    return axios.post(url, data);
}

export const login = (data) => {
    let url = baseUrl + '/login';
    return axios.post(url, data);
}

export const signup = (data) => {
    let url = baseUrl + '/signup';
    return axios.post(url, data);
}

export const getProjects = () => {
    let url = baseUrl + '/project';
    return axios.get(url, {headers: {"x-auth": localStorage.getItem("token")}});
}