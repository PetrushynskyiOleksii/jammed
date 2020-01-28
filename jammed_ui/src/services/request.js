import axios from 'axios';

const host = 'http://127.0.0.1:5000';
const apiVersion = '/api/v1';


function get(url, params){
    url = host + apiVersion + url;
    return axios.get(url, { params });
}


export default { get };
