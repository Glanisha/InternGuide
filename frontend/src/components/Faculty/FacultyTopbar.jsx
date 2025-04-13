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
          <p className="text-sm text-neutral-400">Welcome back</p>
         
        </div>
       
      </div>
    </header>
  );
};

export default FacultyTopBar;