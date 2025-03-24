import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, ArrowDown, Briefcase, Book, Award, Code, Menu, X, Globe, Zap, Users, Building, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InternGuidePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();


  const resetTilt = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 relative">
      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrollY > 50 ? 'py-3 backdrop-blur-md bg-white/80 shadow-lg' : 'py-5 bg-transparent'}`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className={`text-2xl font-bold transition-colors duration-500 flex items-center ${scrollY > 50 ? 'text-purple-800' : 'text-white'}`}>
              <span className="relative mr-2">
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-600 to-pink-500 filter blur-sm opacity-70"></span>
                <span className="relative inline-block">i</span>
              </span>
              InternGuide
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Internships', 'Resources', 'About'].map((item, index) => (
                <a key={index} href="#" className={`transition-all duration-300 relative group ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}

              <button
                onClick={() => navigate('/login')}
                className="relative inline-flex items-center justify-center px-8 py-3 font-bold overflow-hidden rounded-full group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-blue-500 group-hover:from-blue-500 group-hover:via-purple-700 group-hover:to-purple-600 transition-all duration-700"></span>
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 opacity-30 group-hover:rotate-90 ease"></span>
                <span className="relative text-white flex items-center">
                  Get Started
                  <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </button>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-purple-800 z-50">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-purple-900/90 backdrop-blur-lg z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="h-full flex flex-col items-center justify-center">
            <div className="flex flex-col space-y-8 text-center">
              {['Home', 'Internships', 'Resources', 'About'].map((item, index) => (
                <a key={index} href="#" className="text-white text-2xl font-bold hover:text-purple-300 transition-colors">
                  {item}
                </a>
              ))}
              <button onClick={() => navigate('/login')} className="mt-8 bg-white text-purple-800 px-8 py-3 rounded-full font-bold">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
     
    </div>
  );
};

export default InternGuidePage;