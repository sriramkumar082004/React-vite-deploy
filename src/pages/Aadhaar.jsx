import { useState } from "react";
import { extractAadhaar } from "../services/api";
import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

function Aadhaar() {
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Aadhaar Extraction
          </h1>
          <p className="text-slate-500">
            Upload an Aadhaar card image to automatically extract details
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-5 h-5 text-indigo-600" />
              Upload Document
            </h2>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors text-center">
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
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                  <ArrowUpTrayIcon className="w-6 h-6" />
                </div>
                <span className="text-slate-600 font-medium">
                  {file ? file.name : "Click to select or drag file"}
                </span>
                <span className="text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-6 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                loading || !file
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              Extracted Information
            </h2>

            {data ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-lg group hover:bg-indigo-50 transition-colors">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-700 font-semibold break-all">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 border border-slate-100 rounded-xl bg-slate-50/50">
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
