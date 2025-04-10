import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiHome, FiCalendar, FiMessageSquare, FiSettings, FiBriefcase } from 'react-icons/fi';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        <nav className="p-4 space-y-2">
          <a
            href="/student/dashboard"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </a>
          <a
            href="/student/internships"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/internships' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiBriefcase size={20} />
            <span>Internships</span>
          </a>
          <a
            href="/student/profile"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/profile' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiUser size={20} />
            <span>My Profile</span>
          </a>
          <a
            href="/student/schedule"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/schedule' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiCalendar size={20} />
            <span>Schedule</span>
          </a>
          <a
            href="/student/messages"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/messages' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiMessageSquare size={20} />
            <span>Messages</span>
          </a>
          <a
            href="/student/generate-report"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${location.pathname === '/student/settings' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiSettings size={20} />
            <span>Report</span>
          </a>
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