import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!API) {
      console.error("API URL missing");
      return;
    }

    fetch(`${API}/students`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => setStudents(data))
      .catch(err => console.error(err));
  }, [API]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student List</h2>

      {students.length === 0 && <p>No students found</p>}

      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.name} - {s.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
