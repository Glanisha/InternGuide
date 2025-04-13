import { FiX, FiUsers, FiHome, FiCalendar, FiMessageSquare, FiSettings, FiLogOut } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const FacultySidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    closeMobileSidebar();
    navigate('/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-neutral-900/70 backdrop-blur-sm border-r border-white/10 z-30 transition-all duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Faculty Portal
          </h1>
          <button 
            onClick={closeMobileSidebar} 
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 flex flex-col h-[calc(100%-120px)]">
          <div className="space-y-2 flex-1">
            <NavLink
              to="/faculty/dashboard"
              onClick={closeMobileSidebar}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiHome size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/faculty/mentees"
              onClick={closeMobileSidebar}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiUsers size={20} />
              <span>My Mentees</span>
            </NavLink>
            <NavLink
              to="/faculty/messages"
              onClick={closeMobileSidebar}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiMessageSquare size={20} />
              <span>Messages</span>
            </NavLink>
            <NavLink
              to="/faculty/analytics"
              onClick={closeMobileSidebar}
              className={({ isActive }) => 
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`
              }
            >
              <FiSettings size={20} />
              <span>Analytics</span>
            </NavLink>
          </div>

          {/* Logout button at the bottom */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-red-500/20 hover:text-red-400 transition-all mt-auto"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default FacultySidebar;