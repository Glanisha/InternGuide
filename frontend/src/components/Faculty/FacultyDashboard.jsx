import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUsers, FiHome, FiCalendar, FiMessageSquare, FiSettings } from 'react-icons/fi';

const FacultyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mentees');

  // Sample mentee data
  const mentees = [
    { id: 1, name: 'Alex Johnson', progress: 75, lastMeeting: '2023-06-15' },
    { id: 2, name: 'Sarah Williams', progress: 60, lastMeeting: '2023-06-10' },
    { id: 3, name: 'Michael Chen', progress: 90, lastMeeting: '2023-06-12' },
    { id: 4, name: 'Emma Davis', progress: 45, lastMeeting: '2023-05-28' },
  ];

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
            Faculty Portal
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { setActiveTab('mentees'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'mentees' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiUsers size={20} />
            <span>My Mentees</span>
          </button>
          <button
            onClick={() => { setActiveTab('schedule'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiCalendar size={20} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'messages' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiMessageSquare size={20} />
            <span>Messages</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiSettings size={20} />
            <span>Settings</span>
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
              <p className="font-medium">Dr. Smith</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-medium">JS</span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-black to-neutral-900/50">
          {activeTab === 'mentees' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  My Mentees
                </h2>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
                  Add New Mentee
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentees.map(mentee => (
                  <div key={mentee.id} className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-400 font-medium">
                          {mentee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{mentee.name}</h3>
                        <p className="text-xs text-neutral-400">Last meeting: {mentee.lastMeeting}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{mentee.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" 
                          style={{ width: `${mentee.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        Message
                      </button>
                      <button className="flex-1 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                Dashboard
              </h2>
              <p className="text-neutral-400">Dashboard content will go here</p>
            </div>
          )}

          {/* Add other tab contents similarly */}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;