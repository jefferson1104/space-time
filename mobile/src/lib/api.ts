import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://192.168.1.69:3333', // check your local ip address
})
