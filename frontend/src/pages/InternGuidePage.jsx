import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, ArrowDown, Briefcase, Book, Award, Code, Menu, X, Globe, Zap, Users, Building, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InternGuidePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Initial loading animation
    setTimeout(() => {
      setLoaded(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const tiltCard = (e, intensity = 10) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * intensity;
    const tiltY = -((x - centerX) / centerX) * intensity;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mb-4 inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  Launch Your Career
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="block relative overflow-hidden">
                    <span className="block animate-reveal">Find Your</span>
                  </span>
                  <span className="block relative overflow-hidden">
                    <span className="block animate-reveal" style={{ animationDelay: '400ms' }}>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">Dream Internship</span>
                    </span>
                  </span>
                </h1>
                <p className="text-lg text-white/80 mb-8 relative overflow-hidden">
                  <span className="block animate-reveal" style={{ animationDelay: '800ms' }}>
                    Connect with top companies, get personalized mentorship, and launch your career with confidence.
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:w-auto bg-white relative group px-8 py-4 rounded-full font-bold text-purple-900 hover:text-purple-700 overflow-hidden transition-colors">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-purple-100 to-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center">
                      Browse Internships
                      <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button className="w-full sm:w-auto relative group px-8 py-4 rounded-full overflow-hidden">
                    <span className="absolute inset-0 w-full h-full border border-white/30 rounded-full group-hover:border-white/60 transition-colors"></span>
                    <span className="absolute inset-0 w-full h-full bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"></span>
                    <span className="relative text-white font-bold">For Companies</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div
                className={`relative transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                onMouseMove={tiltCard}
                onMouseLeave={resetTilt}
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-xl rounded-2xl transform translate-x-2 translate-y-2"></div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>

                  <div className="relative">
                    <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mr-3 shadow-lg">
                        <Globe className="text-white" size={20} />
                      </span>
                      How it works
                    </h3>

                    {[
                      { number: 1, title: "Create your profile", icon: <Users size={20} /> },
                      { number: 2, title: "Browse opportunities", icon: <Briefcase size={20} /> },
                      { number: 3, title: "Apply with one click", icon: <Zap size={20} /> },
                      { number: 4, title: "Get hired & start your career", icon: <Award size={20} /> },
                    ].map((step, index) => (
                      <div key={index} className="relative mb-6 last:mb-0 pl-12">
                        {index !== 3 && (
                          <div className="absolute left-5 top-8 w-0.5 h-12 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                        )}
                        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/30">
                          <span className="text-white font-bold">{step.number}</span>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                          <h4 className="text-white font-bold flex items-center">
                            <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                              {step.icon}
                            </span>
                            {step.title}
                          </h4>
                          <p className="text-white/70 text-sm mt-1">
                            {index === 0 && "Showcase your skills and preferences with our AI-powered profile builder"}
                            {index === 1 && "Explore curated internships matched to your unique profile and skills"}
                            {index === 2 && "Submit applications effortlessly with our streamlined process"}
                            {index === 3 && "Join the 92% of students who succeed through our platform"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="text-white/70" size={32} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">About InternGuide</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We are dedicated to helping students find meaningful internships that kickstart their careers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="text-purple-600" size={40} />,
                title: "Premium Opportunities",
                description: "Access exclusive internships at top companies and startups.",
              },
              {
                icon: <Book className="text-purple-600" size={40} />,
                title: "Personalized Mentorship",
                description: "Get matched with industry professionals for guidance.",
              },
              {
                icon: <Code className="text-purple-600" size={40} />,
                title: "Skills Development",
                description: "Access workshops and resources to stand out in the job market.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who found their dream internships through InternGuide.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InternGuide helped me land my dream internship at a top tech company!",
                name: "Alex Johnson",
                title: "Software Engineering, Stanford",
              },
              {
                quote: "The mentorship program was incredibly helpful in preparing for interviews.",
                name: "Maria Garcia",
                title: "UX Design, NYU",
              },
              {
                quote: "I found multiple internship opportunities that matched my skills perfectly.",
                name: "Raj Patel",
                title: "Data Science, MIT",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">InternGuide</h3>
              <p className="text-gray-400">Empowering students to launch their careers through meaningful internships.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Internships', 'Resources', 'About'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Blog', 'FAQs', 'Interview Prep', 'Mentorship'].map((resource, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">{resource}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <p className="text-gray-400 mb-2">Email: support@internguide.com</p>
              <p className="text-gray-400 mb-2">Phone: +1 (555) 123-4567</p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} InternGuide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InternGuidePage;