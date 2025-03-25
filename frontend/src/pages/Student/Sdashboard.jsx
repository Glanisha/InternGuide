import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Student/Sidebar';

const Sdashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Sdashboard;