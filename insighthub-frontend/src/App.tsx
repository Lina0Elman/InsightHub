import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Chat from './pages/Chat';
import RequireAuth from './hoc/RequireAuth';
import TopBar from './components/TopBar';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><TopBar/><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><TopBar/><Profile /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><TopBar/><Chat /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Footer/>
    </>
  );
};

export default App;
