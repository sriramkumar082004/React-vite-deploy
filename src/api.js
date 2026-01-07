import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "https://fast-api-server-bi71.onrender.com").replace(/\/$/, "");

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing");
}

console.log("API URL =>", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getStudents = () => API.get("/students");

export const addStudent = (student) => API.post("/students", student);

export const deleteStudent = (id) => API.delete(`/students/${id}`);

export const updateStudent = (id, student) => API.put(`/students/${id}`, student);

// Auth Functions
export const login = (credentials) => API.post("/login", credentials);

export const register = (credentials) => API.post("/register", credentials);

export default API;



