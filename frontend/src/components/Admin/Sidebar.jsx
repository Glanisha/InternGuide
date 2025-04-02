import { Home, Briefcase, Users, Settings } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, sidebarOpen, setSidebarOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'internships', label: 'Internships', icon: <Briefcase size={20} /> },
    { id: 'mentors', label: 'Mentor Assignment', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className={`lg:flex flex-col w-64 ${sidebarOpen ? 'fixed inset-0 z-40 block' : 'hidden'}`}>
      {sidebarOpen && (
        <div className="absolute inset-0 bg-black opacity-80 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <nav className={`fixed lg:relative top-0 left-0 bottom-0 flex flex-col w-64 bg-gray-900 bg-opacity-20 backdrop-blur-lg p-4 z-50`}>
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-800">
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setCurrentTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-2 rounded-md transition-colors ${
                  currentTab === item.id 
                    ? 'bg-gray-800 bg-opacity-50 text-white' 
                    : 'hover:bg-gray-800 hover:bg-opacity-30'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}