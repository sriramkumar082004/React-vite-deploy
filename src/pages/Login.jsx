import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser, wakeUpServer } from "../services/api";
import { LockClosedIcon } from "@heroicons/react/24/solid";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wake up server immediately when page loads
    wakeUpServer().catch(() => {
      // Ignore errors, just trying to wake it up
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Show "Waking up" message if it takes more than 2 seconds
    const wakeUpTimer = setTimeout(() => setIsWakingUp(true), 2000);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await loginUser({ email, password });
      clearTimeout(wakeUpTimer);
      localStorage.setItem("token", res.data.access_token);
      toast.success("Login Successful!", { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      clearTimeout(wakeUpTimer);
      console.error("Login Error:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        toast.error("Incorrect password. Please enter the valid password.", { id: toastId });
      } else if (error.response && error.response.status === 404) {
        toast.error("Account not found. Please register.", { id: toastId });
      } else {
        toast.error(`Login failed: ${error.response?.data?.detail || error.message || "Unknown error"}`, { id: toastId });
      }
    } finally {
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="w-6 h-6 text-white" />
          </div>
          
          <p className="text-white/70 text-sm mt-2">Sign in to continue to your dashboard</p>
          {isWakingUp && <p className="text-amber-300 text-xs mt-1 animate-pulse">Waking up server...</p>}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 outline-none transition-all"
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div>
            <input 
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 outline-none transition-all"
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
