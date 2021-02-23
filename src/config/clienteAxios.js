import axios from 'axios';

const clienteAxios = axios.create({
    //baseURL: 'http://192.168.1.114:5005/api',
    baseURL: 'http://192.168.1.115:5005/api'
    // baseURL: 'http://192.168.42.110:5005/api',
    //baseURL: 'https://abc-platform.herokuapp.com/api'
});

export default clienteAxios;