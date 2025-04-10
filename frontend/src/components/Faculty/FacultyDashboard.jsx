import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import FacultySidebar from './FacultySidebar';
import FacultyTopBar from './FacultyTopBar';

const FacultyDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <FacultySidebar 
        isMobileOpen={mobileSidebarOpen} 
        closeMobileSidebar={closeMobileSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FacultyTopBar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-black to-neutral-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;