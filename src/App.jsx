import { useEffect, useState } from "react";
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "./api";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editId, setEditId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);

    try {
      if (editId) {
        await updateStudent(editId, form);
        setEditId(null);
      } else {
        await addStudent(form);
      }
      console.log("Operation successful");
      setForm({ name: "", email: "", age: "" });
      fetchStudents();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save student! Check console for errors.");
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditId(student.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{editId ? "Edit Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        /><br /><br />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        /><br /><br />

        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        /><br /><br />

        <button>{editId ? "Update" : "Add"}</button>
      </form>

      <hr />

      <h2>Student List</h2>

      {students.map((s) => (
        <div key={s.id}>
          {s.name} | {s.email} | {s.age}
          <button onClick={() => handleEdit(s)}>Edit</button>
          <button onClick={() => deleteStudent(s.id).then(fetchStudents)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
