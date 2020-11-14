import axios from 'axios';

const api = axios.create({
  baseURL: `${location.origin}/api`,
  withCredentials: true,
});

export default api;
