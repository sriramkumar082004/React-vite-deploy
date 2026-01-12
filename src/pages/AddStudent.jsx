import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addStudent, updateStudent, getStudents } from "../services/api";
import { UserPlusIcon, UserIcon, AcademicCapIcon, CalendarIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (id) {
       fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
      try {
          const res = await getStudents();
          const student = res.data.find(s => (s._id || s.id) === id);
          if (student) {
              setFormData({ name: student.name, age: student.age, course: student.course });
          }
      } catch (err) {
          console.error("Error fetching student:", err);
          setMessage({ type: "error", text: "Failed to fetch student details" });
      }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.course) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (id) {
          await updateStudent(id, formData);
          setMessage({ type: "success", text: "Student updated successfully! Redirecting..." });
      } else {
          await addStudent(formData);
          setMessage({ type: "success", text: "Student added successfully! Redirecting..." });
      }
      setFormData({ name: "", age: "", course: "" });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to add student. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-20">
      <div className="max-w-xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {id ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="text-slate-500">
            {id ? "Update student details" : "Enter student details to register them in the system"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ex. 20"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-gray-900 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="course" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-slate-400" />
                  Course
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Ex. B.Tech"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-gray-900 bg-white"
                />
              </div>
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message.type === "success" ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all transform active:scale-95 ${
                loading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-200"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {id ? <PencilSquareIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
                  {id ? "Update Student" : "Add Student"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
