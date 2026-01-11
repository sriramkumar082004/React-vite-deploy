import axios from 'axios';

const api = axios.create({
    baseURL: 'https://fast-api-server-bnf5.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Login user
export const loginUser = (credentials) => api.post('/login', credentials);

// Register user
export const registerUser = (userData) => api.post('/register', userData);

// Extract Aadhaar data
export const extractAadhaar = (formData) => api.post('/extract-aadhaar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Add new student
export const addStudent = (studentData) => api.post('/students', studentData);

export default api;
