import axios from "axios"

// TODO: process env
const host = "http://localhost:5000"
const apiVersion = "/api/v1"


function get(path, params = {}, headers = {}){
    const url = host + apiVersion + path
    return axios.get(url, { params, headers })
}

export default { get }
