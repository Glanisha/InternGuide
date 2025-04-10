import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginRoute } from '../utils';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(loginRoute, {
        email,
        password,
      });
      const { token, role } = response.data;
      localStorage.setItem('token', token);

      if (role === 'student') {
        navigate('/student');
      } else if (role === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'management') {
        navigate('/management-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black w-full flex items-center justify-center p-4">
      {/* Glass effect container */}
      <div className="w-full max-w-md backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl shadow-blue-500/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-normal pb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
            Welcome Back
          </h2>
          <p className="text-xs md:text-base font-normal text-center text-neutral-400 mt-2 max-w-lg mx-auto">
            Login to access your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white hover:bg-white/90 text-black font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
            >
              Sign up
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

export default LoginForm;