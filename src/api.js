import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "https://fast-api-server-bi71.onrender.com").replace(/\/$/, "");

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing");
}

console.log("API URL =>", BASE_URL);

export const getStudents = () => axios.get(`${BASE_URL}/students`);

export const addStudent = (student) => axios.post(`${BASE_URL}/students`, student);

export const deleteStudent = (id) => axios.delete(`${BASE_URL}/students/${id}`);

export const updateStudent = (id, student) =>
  axios.put(`${BASE_URL}/students/${id}`, student);
