// src/components/admin/Sidebar.jsx
import { FiHome, FiBriefcase, FiUsers, FiSettings, FiX } from 'react-icons/fi';

export default function Sidebar({ sidebarOpen, toggleSidebar, currentTab, setCurrentTab }) {
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
        <button
          onClick={() => { setCurrentTab('dashboard'); toggleSidebar(); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiHome size={20} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => { setCurrentTab('internships'); toggleSidebar(); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'internships' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiBriefcase size={20} />
          <span>Internships</span>
        </button>
        <button
          onClick={() => { setCurrentTab('mentors'); toggleSidebar(); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'mentors' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiUsers size={20} />
          <span>Mentor Assignment</span>
        </button>
        <button
          onClick={() => { setCurrentTab('settings'); toggleSidebar(); }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
        >
          <FiSettings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2 text-sm bg-red-600/90 hover:bg-red-700/90 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}