import { useState } from "react";
import { register } from "../src/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register({ email, password });
      alert("Registered successfully");
      window.location.href = "/login";
    } catch (error) {
       alert("Registration failed: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <input 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
        value={email}
        style={{ marginRight: 10 }}
      />
      <input 
        type="password" 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password" 
        value={password}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

