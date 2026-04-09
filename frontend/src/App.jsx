import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SchemeList from './pages/SchemeList';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FarmerRegistration from './pages/FarmerRegistration';
import Suggestion from './pages/Suggestion';
import FarmerLogin from './pages/FarmerLogin';
import AdminLogin from './pages/AdminLogin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>🌾 Farmer Scheme Portal</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/schemes">Schemes</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/register-farmer">Register</Link>
            <Link to="/suggestions">Feedback</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/login">Farmer Login</Link>
            <Link to="/admin-login">Admin Login</Link>
          </nav>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schemes" element={<SchemeList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register-farmer" element={<FarmerRegistration />} />
          <Route path="/suggestions" element={<Suggestion />} />
          <Route path="/login" element={<FarmerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;