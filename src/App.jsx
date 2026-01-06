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

      <ul>
        {students.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            {s.name} - {s.age} - {s.email}
            <button 
                onClick={() => handleEdit(s)} 
                style={{ marginLeft: 10, marginRight: 5 }}
            >
                Edit
            </button>
            <button 
                onClick={() => handleDelete(s.id)}
                style={{ backgroundColor: "#ffcccc" }}
            >
                Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
