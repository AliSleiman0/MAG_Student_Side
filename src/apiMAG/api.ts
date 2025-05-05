import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
localStorage.setItem('authToken', "bearer 15|culA8B7kCzbnAM7sst5up4qYJN85ipof4R6mSKEU3245671d");
// Create axios instance with custom config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Pragma: 'no-cache',
        'Cache-control': 'no-cache',
    },
    timeout: 20000,
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;