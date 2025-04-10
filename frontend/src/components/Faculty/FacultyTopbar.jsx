import { FiMenu } from 'react-icons/fi';

const FacultyTopBar = ({ toggleSidebar }) => {
  return (
    <header className="bg-neutral-900/70 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
      <button 
        onClick={toggleSidebar} 
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
  );
};

export default FacultyTopBar;