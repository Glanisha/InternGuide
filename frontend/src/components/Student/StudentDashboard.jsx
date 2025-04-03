import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiHome, FiCalendar, FiMessageSquare, FiSettings, FiBook, FiAward, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import { getAllInternshipsRoute, studentProfileUpdate } from '../../utils';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [internships, setInternships] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showRecommended, setShowRecommended] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    interests: [],
    cgpa: "",
    resume: "",
    achievements: [],
    phoneNumber: "",
    linkedinProfile: "",
    portfolioWebsite: "",
    certifications: [],
    availability: "",
    preferredRoles: [],
    locationPreference: "",
    references: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch internships
        const internshipsResponse = await axios.get(getAllInternshipsRoute);
        setInternships(internshipsResponse.data);

        // Fetch recommended internships
        const token = localStorage.getItem("token");
        const recommendedResponse = await axios.get(
          "http://localhost:8000/api/student/best-internship",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecommendedInternships(recommendedResponse.data);

        // Fetch profile data
        const profileResponse = await axios.get("http://localhost:8000/api/student/me", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setFormData(profileResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(studentProfileUpdate, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const applyForInternship = (internshipId) => {
    console.log("Applying for internship:", internshipId);
    // Implement your apply functionality here
  };

  const filteredInternships = showRecommended 
    ? recommendedInternships.filter((internship) => {
        if (!searchTerm) return true;
        
        if (filter === "company") {
          return internship.company.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filter === "skills") {
          return internship.skillsRequired?.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return (
          internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.skillsRequired?.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          internship.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : internships;

  if (loading) return null;

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
            Student Portal
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
            onClick={() => { setActiveTab('internships'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'internships' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiBriefcase size={20} />
            <span>Internships</span>
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiUser size={20} />
            <span>My Profile</span>
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
              <p className="font-medium">Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-medium">S</span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-black to-neutral-900/50">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
                  {/* Placeholder for events */}
                  <p className="text-neutral-400">No upcoming events</p>
                </div>
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Applications</h3>
                  {/* Placeholder for applications */}
                  <p className="text-neutral-400">No recent applications</p>
                </div>
              </div>
              
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Recommended Internships</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedInternships.slice(0, 3).map((internship) => (
                    <InternshipCard 
                      key={internship._id} 
                      internship={internship} 
                      onApply={applyForInternship}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'internships' && (
            <div>
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  Internship Opportunities
                </h2>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => setShowRecommended(!showRecommended)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all"
                  >
                    {showRecommended ? "Show All" : "Get Recommendations"}
                  </button>
                </div>
              </div>

              {showRecommended && (
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 mb-6 rounded-lg bg-neutral-900/50 border border-white/10">
                  <h3 className="text-lg font-medium text-white">Recommended For You</h3>
                  
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Search internships..."
                      className="px-4 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                      className="px-4 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="company">Company</option>
                      <option value="skills">Skills</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((internship) => (
                  <InternshipCard 
                    key={internship._id} 
                    internship={internship} 
                    onApply={applyForInternship}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                My Profile
              </h2>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Skills (comma-separated):</label>
                      <input 
                        type="text" 
                        name="skills" 
                        value={formData.skills.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "skills")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Interests (comma-separated):</label>
                      <input 
                        type="text" 
                        name="interests" 
                        value={formData.interests.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "interests")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">CGPA:</label>
                      <input 
                        type="number" 
                        name="cgpa" 
                        value={formData.cgpa} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        step="0.1" 
                        min="0" 
                        max="10" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Resume (URL):</label>
                      <input 
                        type="url" 
                        name="resume" 
                        value={formData.resume} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Achievements (comma-separated):</label>
                      <input 
                        type="text" 
                        name="achievements" 
                        value={formData.achievements.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "achievements")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Phone Number:</label>
                      <input 
                        type="text" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">LinkedIn Profile:</label>
                      <input 
                        type="url" 
                        name="linkedinProfile" 
                        value={formData.linkedinProfile} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Portfolio Website:</label>
                      <input 
                        type="url" 
                        name="portfolioWebsite" 
                        value={formData.portfolioWebsite} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Certifications (comma-separated):</label>
                      <input 
                        type="text" 
                        name="certifications" 
                        value={formData.certifications.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "certifications")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Availability:</label>
                      <select 
                        name="availability" 
                        value={formData.availability} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="">Select</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Preferred Roles (comma-separated):</label>
                      <input 
                        type="text" 
                        name="preferredRoles" 
                        value={formData.preferredRoles.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "preferredRoles")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Location Preference:</label>
                      <input 
                        type="text" 
                        name="locationPreference" 
                        value={formData.locationPreference} 
                        onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">References (comma-separated):</label>
                      <input 
                        type="text" 
                        name="references" 
                        value={formData.references.join(", ")} 
                        onChange={(e) => handleArrayChange(e, "references")} 
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full md:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                My Schedule
              </h2>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-neutral-400">Schedule content will go here</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                Messages
              </h2>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-neutral-400">Messages content will go here</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
                Settings
              </h2>
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <p className="text-neutral-400">Settings content will go here</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Reusable Internship Card Component
const InternshipCard = ({ internship, onApply }) => {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
      <div className="flex items-start mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <span className="text-blue-400 font-medium">
            {internship.company.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-white">{internship.company}</h3>
          <p className="text-sm text-neutral-300">{internship.title}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 my-3">
        <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
          {internship.mode}
        </span>
        <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
          {internship.department}
        </span>
        {internship.skillsRequired?.slice(0, 2).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Duration</span>
          <span className="text-white">{internship.internshipDuration}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Stipend</span>
          <span className="text-white">₹{internship.stipend || 'Not specified'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button 
          className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          onClick={() => {/* View details action */}}
        >
          Details
        </button>
        <button 
          className="flex-1 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
          onClick={() => onApply(internship._id)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;