import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IdentificationIcon, UserPlusIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-4 md:p-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-slate-400">Select an action</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aadhaar Extraction Card */}
          <div 
            onClick={() => navigate('/aadhaar')}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer border border-white/5 hover:border-indigo-500/50 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <IdentificationIcon className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Aadhaar Extraction</h2>
              <p className="text-slate-400 leading-relaxed">
                Upload an Aadhaar card image to extract details.
              </p>
            </div>
          </div>

          
          {/* Add Student Card */}
          <div 
            onClick={() => navigate('/add-student')}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer border border-white/5 hover:border-pink-500/50 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                <UserPlusIcon className="w-8 h-8 text-pink-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Manage Students</h2>
              <p className="text-slate-400 leading-relaxed">
                Add, Edit, View, or Delete students.
              </p>
            </div>
          </div>

          {/* Image Background Card */}
          <div 
            onClick={() => navigate('/change-background')}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-violet-500/20 transition-all duration-300 cursor-pointer border border-white/5 hover:border-violet-500/50 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 transition-colors duration-300">
                <PhotoIcon className="w-8 h-8 text-violet-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Remove Background</h2>
              <p className="text-slate-400 leading-relaxed">
                Remove or replace image backgrounds instantly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
