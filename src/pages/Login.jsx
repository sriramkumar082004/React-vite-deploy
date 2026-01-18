import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser, wakeUpServer } from "../services/api";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-purple-500/20 rounded-full blur-[100px] animate-bounce duration-10000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6 group transform hover:scale-105 transition-transform duration-300">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm text-center">
              Enter your credentials to access your dashboard
            </p>
            
            {isWakingUp && (
              <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center animate-pulse">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-amber-500 text-xs font-medium">Waking up server...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 pl-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <input 
                  className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 group-hover:border-slate-600"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 pl-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <input 
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 group-hover:border-slate-600"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)} 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-linear-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
