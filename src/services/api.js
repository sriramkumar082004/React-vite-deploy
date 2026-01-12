import axios from 'axios';



const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Get all students
export const getStudents = () => api.get('/students');

// Delete student
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Update student
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);

// Wake up server (prevent cold start)
export const wakeUpServer = () => api.get('/');

export default api;
