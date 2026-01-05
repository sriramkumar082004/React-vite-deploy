import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});


export const getStudents = () => API.get("/students");
export const addStudent = (student) => API.post("/students", student);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const updateStudent = (id, student) =>
  API.put(`/students/${id}`, student);


