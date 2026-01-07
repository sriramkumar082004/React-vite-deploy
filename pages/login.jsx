import { useState } from "react";
import { login } from "../src/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

