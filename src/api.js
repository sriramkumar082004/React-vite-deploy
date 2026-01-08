import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing");
}

console.log("API URL =>", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; 
  }
  return req;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getStudents = () => api.get("/students");

export const addStudent = (student) => api.post("/students", student);

export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const updateStudent = (id, student) => api.put(`/students/${id}`, student);

// Auth Functions
export const login = (credentials) => api.post("/login", credentials);

export const register = (credentials) => api.post("/register", credentials);

export default api;



