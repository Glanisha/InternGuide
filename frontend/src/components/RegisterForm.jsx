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
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl shadow-blue-500/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-normal pb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
            Create Account
          </h2>
          <p className="text-xs md:text-base font-normal text-center text-neutral-400 mt-2 max-w-lg mx-auto">
            Join our platform to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900/70 border border-neutral-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-neutral-200 placeholder-neutral-500"
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900/70 border border-neutral-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-neutral-200 placeholder-neutral-500"
              placeholder="Email Address"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900/70 border border-neutral-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-neutral-200 placeholder-neutral-500"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900/70 border border-neutral-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-neutral-200"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="management">Management</option>
            </select>
          </div>

          {(role === 'student' || role === 'faculty') && (
            <div>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-900/70 border border-neutral-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-neutral-200 placeholder-neutral-500"
                placeholder="Department"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white hover:bg-white/90 text-black font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-400 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
            >
              Login
            </button>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-5 gap-2 max-w-md mx-auto">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div 
              key={percent}
              className="h-0.5 rounded-full"
              style={{
                backgroundColor: percent === 50 ? '#3B82F6' : '#374151',
                opacity: percent === 50 ? 1 : 0.3
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;