import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerRoute } from '../utils';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate department for student and faculty roles
    if ((role === 'student' || role === 'faculty') && !department) {
      setError('Department is required for students and faculty');
      return;
    }

    try {
      const response = await axios.post(registerRoute, {
        name,
        email,
        password,
        role,
        department: role === 'student' || role === 'faculty' ? department : null,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Redirect to login or dashboard based on your flow
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
          <option value="management">Management</option>
        </select>
      </div>
      {/* Show department field for student and faculty roles */}
      {(role === 'student' || role === 'faculty') && (
        <div>
          <label>Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;