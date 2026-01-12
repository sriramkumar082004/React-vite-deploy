import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IdentificationIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 pt-20">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-gray-600">Select an action</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Manage Students</h2>
              <p className="text-gray-500 leading-relaxed">
                Add, Edit, View, or Delete students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
