// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Make sure this path matches your folder structure

const LoginPage = () => {
  const [instructorId, setInstructorId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static check for now
    if (instructorId === 'ovya' && password === '2004') {
      navigate('/index'); // Redirect to IndexPage after successful login
    } else {
      alert('Invalid Instructor ID or Password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Instructor Login</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              id="instructor_id"
              name="instructor_id"
              placeholder="Instructor ID"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
