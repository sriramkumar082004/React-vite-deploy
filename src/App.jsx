import { useEffect, useState } from "react";
import "./App.css";
import { getStudents, deleteStudent } from "./api"; // Added deleteStudent import

import StudentForm from "./components/StudentForm";

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); // State for editing
  const [error, setError] = useState("");

  const fetchStudents = () => {
    getStudents()
      .then((res) => {
        console.log("Fetch result:", res.data); // Debugging
        if (Array.isArray(res.data)) {
          setStudents(res.data);
          setError("");
        } else {
          console.error("Unexpected API response format:", res.data);
          setError("API Error: Backend returned an object instead of a list. (Check console)");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`Failed to load students: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id)
        .then(() => {
          fetchStudents();
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to delete student");
        });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const onStudentAddedOrUpdated = () => {
      setEditingStudent(null);
      fetchStudents();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Student List</h2>

      <StudentForm 
        onStudentAdded={onStudentAddedOrUpdated} 
        currentStudent={editingStudent}
        onCancelEdit={handleCancelEdit}
      />

      {error && <div style={{ color: "red", marginTop: 10, padding: 10, border: '1px solid red' }}>
        <strong>Error:</strong> {error}
      </div>}

      {students.length === 0 && !error && (
        <p>No students found</p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Age</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{s.name}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{s.age}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{s.email}</td>
              <td style={{ padding: 10, border: "1px solid #ddd", textAlign: "center" }}>
                <button 
                    onClick={() => handleEdit(s)} 
                    style={{ marginRight: 10, padding: "5px 10px", cursor: "pointer" }}
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(s.id)}
                    style={{ backgroundColor: "#ff4d4d", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                >
                    Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
