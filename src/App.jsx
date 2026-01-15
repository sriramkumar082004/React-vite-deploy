import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Aadhaar from './pages/Aadhaar';
import AddStudent from './pages/AddStudent';
import Dashboard from './pages/Dashboard';

import './App.css';

import { Toaster } from 'react-hot-toast';

import ImageBackground from './pages/ImageBackground';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aadhaar" element={<Aadhaar />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<AddStudent />} />
        <Route path="/change-background" element={<ImageBackground />} />
      </Routes>
    </>
  );
}

export default App;
