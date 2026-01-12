import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IdentificationIcon, UserPlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await import('../services/api').then(mod => mod.getStudents());
      setStudents(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
        try {
            await import('../services/api').then(mod => mod.deleteStudent(id));
            setStudents(students.filter(student => (student._id || student.id) !== id));
        } catch (err) {
            console.error("Error deleting student:", err);
            alert("Failed to delete student");
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 pt-20">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-gray-600">Select an action or view registered students</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aadhaar Extraction Card */}
          <div 
            onClick={() => navigate('/aadhaar')}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-500/30 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <IdentificationIcon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Aadhaar Extraction</h2>
              <p className="text-gray-500 leading-relaxed">
                Scan and extract details from Aadhaar.
              </p>
            </div>
          </div>

          {/* Add Student Card */}
          <div 
            onClick={() => navigate('/add-student')}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-500/30 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                <UserPlusIcon className="w-8 h-8 text-pink-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Add Student</h2>
              <p className="text-gray-500 leading-relaxed">
                Manually register a new student into the system.
              </p>
            </div>
          </div>
        </div>

        {/* Student List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">Registered Students</h2>
            <button 
                onClick={fetchStudents} 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
                Refresh List
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                Loading students...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-500 bg-red-50/50">
                {error}
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No students registered yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold rounded-tl-lg">Name</th>
                    <th className="p-4 font-semibold">Age</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Joined</th>
                    <th className="p-4 font-semibold rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((student) => (
                    <tr key={student._id || student.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{student.name}</td>
                      <td className="p-4 text-gray-600">{student.age}</td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-100">
                          {student.course}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date().toLocaleDateString()} 
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/edit-student/${student._id || student.id}`)}
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
};

export default Dashboard;
