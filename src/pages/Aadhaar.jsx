import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { extractAadhaar } from "../services/api";
import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

function Aadhaar() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setData(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await extractAadhaar(formData);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to extract data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-8 relative">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Aadhaar Extraction
          </h1>
          <p className="text-slate-400">
            Upload an Aadhaar card image to extract details
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 h-fit">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-5 h-5 text-indigo-400" />
              Upload Document
            </h2>
            
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 hover:bg-white/5 transition-colors text-center group">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden" 
                id="aadhaar-upload" 
                accept="image/*"
              />
              <label 
                htmlFor="aadhaar-upload" 
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  <ArrowUpTrayIcon className="w-6 h-6" />
                </div>
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                  {file ? file.name : "Click to select or drag file"}
                </span>
                <span className="text-xs text-slate-500">
                  PNG, JPG up to 5MB
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-6 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                loading || !file
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting...
                </>
              ) : (
                "Extract Details"
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-400" />
              Extracted Information
            </h2>

            {data ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="p-3 bg-slate-900/50 border border-white/5 rounded-lg group hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-200 font-semibold break-all">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-slate-700/50 rounded-xl bg-slate-900/20">
                <DocumentTextIcon className="w-12 h-12 mb-2 opacity-20" />
                <p>No data extracted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aadhaar;
