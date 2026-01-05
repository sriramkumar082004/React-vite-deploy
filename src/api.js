import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing");
}

export const API = axios.create({
  baseURL: BASE_URL,
});

export const getStudents = () => API.get("/students");
export const addStudent = (student) => API.post("/students", student);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const updateStudent = (id, student) =>
  API.put(`/students/${id}`, student);

console.log("API URL =>", BASE_URL);
