// client/src/services/api.js
import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

// Instancia central de Axios
const api = axios.create({
  baseURL: API_CONFIG.API_BASE, // '/api' en prod; 'http://localhost:4000/api' en dev si así lo configuras
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: API_CONFIG.TIMEOUT || 10000,
});

// Interceptor para token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
