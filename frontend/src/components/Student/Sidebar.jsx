import React, { useState } from 'react';
import { 
  FiUser, 
  FiBriefcase, 
  FiUsers, 
  FiCheckSquare,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Profile', icon: <FiUser size={20} /> },
    { name: 'Internships', icon: <FiBriefcase size={20} /> },
    { name: 'Mentor', icon: <FiUsers size={20} /> },
    { name: 'Tasks', icon: <FiCheckSquare size={20} /> }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#16191C] text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40
          bg-[#16191C] text-gray-300
          w-64
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          shadow-xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#292E33]">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`
                  w-full flex items-center px-6 py-4
                  text-left
                  transition-colors duration-200
                  ${activeTab === item.name 
                    ? 'bg-[#29CB97] text-white' 
                    : 'hover:bg-[#292E33] text-gray-300'
                  }
                `}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsOpen(false);
                }}
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-[#292E33]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                <FiUser size={18} />
              </div>
              <span className="ml-3">User Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay - Only on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;