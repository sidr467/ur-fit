import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3002/api',  // update if backend is running elsewhere
});

export default API;
