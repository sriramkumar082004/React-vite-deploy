import { useState, useEffect } from "react";
import { addStudent, updateStudent } from "../api";

function StudentForm({ onStudentAdded, currentStudent, onCancelEdit }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentStudent) {
        setName(currentStudent.name);
        setAge(currentStudent.age);
        setEmail(currentStudent.email);
    } else {
        setName("");
        setAge("");
        setEmail("");
    }
  }, [currentStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !email) {
        setError("Please fill in all fields");
        return;
    }
    setError("");

    if (currentStudent) {
        updateStudent(currentStudent.id, { name, age: parseInt(age), email })
            .then(() => {
                onStudentAdded(); // Reuse to refresh list
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to update student");
            });
    } else {
        addStudent({ name, age: parseInt(age), email })
            .then(() => {
                setName("");
                setAge("");
                setEmail("");
                if (onStudentAdded) onStudentAdded();
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to add student");
            });
    }
  };

  return (
    <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}>
      <h3>{currentStudent ? "Edit Student" : "Add New Student"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Age: </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
            {currentStudent ? "Update Student" : "Add Student"}
        </button>
        {currentStudent && (
            <button 
                type="button" 
                onClick={onCancelEdit}
                style={{ marginLeft: 10, marginTop: 10 }}
            >
                Cancel
            </button>
        )}
      </form>
    </div>
  );
}

export default StudentForm;
