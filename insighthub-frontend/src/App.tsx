import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './App.css'
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import RequireAuth from './hoc/RequireAuth';
import NewPost from './pages/NewPost';
import PostDetails from './pages/PostDetails';


const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Footer/>
    </>
  );
};

export default App;
