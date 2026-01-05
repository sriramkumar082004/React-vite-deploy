import { useEffect, useState } from "react";
import { getStudents } from "./api";

function App() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudents()
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load students");
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student List</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {students.length === 0 && !error && (
        <p>No students found</p>
      )}

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} - {s.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
