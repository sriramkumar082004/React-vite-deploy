import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { UserPlusIcon } from "@heroicons/react/24/solid";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.detail || "Registration failed. Try again.";
      setError(Array.isArray(msg) ? msg[0].msg : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <UserPlusIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-white/70 text-sm mt-2">Join us to manage your students</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input 
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 outline-none transition-all"
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 outline-none transition-all"
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <input 
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 outline-none transition-all"
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} 
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-white font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
