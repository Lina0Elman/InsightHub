import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Profile from './components/Profile';
import RequireAuth from './hoc/RequireAuth';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
};

export default App;
