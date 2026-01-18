import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Aadhaar from './pages/Aadhaar';
import AddStudent from './pages/AddStudent';
import Dashboard from './pages/Dashboard';

import './App.css';

import { Toaster } from 'react-hot-toast';
import ImageBackground from './pages/ImageBackground';

function App() {
  const location = useLocation();
  const isAuthPage = ['/', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen text-slate-200 selection:bg-indigo-500 selection:text-white">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: '!bg-slate-800 !text-white !border !border-slate-700',
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }} 
      />
      <Navbar />
      <main className={`transition-all duration-300 ${!isAuthPage ? 'pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aadhaar" element={<Aadhaar />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/edit-student/:id" element={<AddStudent />} />
          <Route path="/change-background" element={<ImageBackground />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
