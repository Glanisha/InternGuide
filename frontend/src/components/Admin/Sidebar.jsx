// src/components/admin/Sidebar.jsx
import { FiHome, FiBriefcase, FiUsers, FiSettings, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  
  // Get the current path after /admin-dashboard/
  const currentPath = location.pathname.split('/admin-dashboard/')[1] || 'dashboard';

  return (
    <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-neutral-900/70 backdrop-blur-sm border-r border-white/10 z-30 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Admin Portal
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden text-neutral-400 hover:text-white"
        >
          <FiX size={24} />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        <Link
          to="/admin-dashboard"
          onClick={toggleSidebar}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPath === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiHome size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin-dashboard/internships"
          onClick={toggleSidebar}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPath.startsWith('internships') ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiBriefcase size={20} />
          <span>Internships</span>
        </Link>
        <Link
          to="/admin-dashboard/mentors"
          onClick={toggleSidebar}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPath === 'mentors' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiUsers size={20} />
          <span>Mentor Assignment</span>
        </Link>
        <Link
          to="/admin-dashboard/settings"
          onClick={toggleSidebar}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPath === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiSettings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2 text-sm bg-red-600/90 hover:bg-red-700/90 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}