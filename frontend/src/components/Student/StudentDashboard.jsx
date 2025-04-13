import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiHome, FiMessageSquare, FiSettings, FiBriefcase, FiUsers, FiFileText } from 'react-icons/fi';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-neutral-900/70 backdrop-blur-sm border-r border-white/10 z-30 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Student Portal
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 flex flex-col h-[calc(100%-120px)]">
          <div className="space-y-2 flex-1">
            <NavLink
              to="/student/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiHome size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/student/internships"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiBriefcase size={20} />
              <span>Internships</span>
            </NavLink>
           
            <NavLink
              to="/student/messages"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiMessageSquare size={20} />
              <span>Messages</span>
            </NavLink>
            <NavLink
              to="/student/mentor"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiUsers size={20} />
              <span>Mentor</span>
            </NavLink>
            <NavLink
              to="/student/generate-report"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiFileText size={20} />
              <span>Report</span>
            </NavLink>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-red-500/20 hover:text-red-400 transition-all mt-auto"
          >
            <FiSettings size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-neutral-900/70 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-neutral-400">Welcome back,</p>
              <p className="font-medium">Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-medium">S</span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-black to-neutral-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;