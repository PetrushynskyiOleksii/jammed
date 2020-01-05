import axios from 'axios';

const host = 'http://127.0.0.1:5000';
const apiVersion = '/api/v1';


function get(url, params){
    url = host + apiVersion + url;
    const response = axios.get(url, { params });
    // TODO: implement handler for errors

    return response
}


export default {get};
