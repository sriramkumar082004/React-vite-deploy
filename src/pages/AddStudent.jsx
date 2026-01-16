import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addStudent, updateStudent, getStudents, deleteStudent } from "../services/api";
import { UserPlusIcon, UserIcon, AcademicCapIcon, CalendarIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    if (id) {
       fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
      try {
          const res = await getStudents();
          // Convert IDs to string for comparison to avoid type mismatches
          const student = res.data.find(s => String(s._id || s.id) === String(id));
          if (student) {
              setFormData({ name: student.name, age: student.age, course: student.course });
          } else {
            console.warn("Student not found for ID:", id);
          }
      } catch (err) {
          console.error("Error fetching student:", err);
          setMessage({ type: "error", text: "Failed to fetch student details" });
      }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
        try {
            await deleteStudent(studentId);
            setStudents(students.filter(student => (student._id || student.id) !== studentId));
            setMessage({ type: "success", text: "Student deleted successfully" });
        } catch (err) {
            console.error("Error deleting student:", err);
            setMessage({ type: "error", text: "Failed to delete student" });
        }
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
          setMessage({ type: "success", text: "Student updated successfully!" });
          setTimeout(() => navigate('/add-student'), 1500); // clear ID
      } else {
          await addStudent(formData);
          setMessage({ type: "success", text: "Student added successfully!" });
      }
      setFormData({ name: "", age: "", course: "" });
      fetchStudents(); // Refresh list

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to add student. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-8 relative">
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

        {/* Student List Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Registered Students</h2>
            <button 
                onClick={fetchStudents} 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
                Refresh List
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                No students registered yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold rounded-tl-lg">Name</th>
                    <th className="p-4 font-semibold">Age</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => (
                    <tr key={student._id || student.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{student.name}</td>
                      <td className="p-4 text-slate-600">{student.age}</td>
                      <td className="p-4 text-slate-600">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-100">
                          {student.course}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                                navigate(`/edit-student/${student._id || student.id}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(student._id || student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
