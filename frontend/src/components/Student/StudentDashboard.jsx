import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiBriefcase, FiUser, FiSettings, FiChevronDown, FiCalendar, FiArrowLeft } from 'react-icons/fi';

// API routes
const getAllInternshipsRoute = '/api/internships';
const studentProfileUpdate = '/api/student/profile';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [internships, setInternships] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    answers: [],
  });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
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

  // Fetch internships with proper error handling
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getAllInternshipsRoute);
      setInternships(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch internships');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'internships' || currentTab === 'dashboard') {
      fetchInternships();
    }
  }, [currentTab]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/student/me", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (currentTab === 'profile') {
      fetchProfile();
    }
  }, [currentTab]);

  const applyForInternship = (internshipId) => {
    const internship = internships.find(i => i._id === internshipId);
    if (internship) {
      setSelectedInternship(internship);
      setCurrentTab('application');
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApplicationInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileArrayChange = (e, field) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    }));
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!resume) {
      setError("Please upload your resume");
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("resume", resume);
      formDataToSend.append("coverLetter", applicationData.coverLetter);
      formDataToSend.append("answers", JSON.stringify(applicationData.answers));
  
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/student/apply/${selectedInternship._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );
  
      alert("Application submitted successfully!");
      setCurrentTab('internships');
    } catch (err) {
      console.error("Application error:", err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(studentProfileUpdate, profileData, {
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

  const renderInternshipCard = (internship) => (
    <div 
      key={internship._id} 
      className="bg-neutral-900/70 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all"
    >
      <div className="flex items-start mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
          {internship.company?.charAt(0) || '?'}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{internship.company || 'Unknown Company'}</h2>
          <h3 className="text-md font-medium text-neutral-300">{internship.title || 'Internship Position'}</h3>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 my-3">
        {internship.mode && (
          <span className="px-2 py-1 bg-neutral-800 text-neutral-200 text-sm rounded">
            {internship.mode}
          </span>
        )}
        {internship.department && (
          <span className="px-2 py-1 bg-neutral-800 text-neutral-200 text-sm rounded">
            {internship.department}
          </span>
        )}
        {internship.internshipDuration && (
          <span className="px-2 py-1 bg-neutral-800 text-neutral-200 text-sm rounded">
            {internship.internshipDuration}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="font-medium text-white">
          Stipend: {internship.stipend ? `₹${internship.stipend}` : 'Not specified'}
        </span>
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
          onClick={() => applyForInternship(internship._id)}
        >
          Apply
        </button>
      </div>
    </div>
  );

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
            onClick={() => { setCurrentTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { setCurrentTab('internships'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'internships' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiBriefcase size={20} />
            <span>Internships</span>
          </button>
          <button
            onClick={() => { setCurrentTab('profile'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'profile' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiUser size={20} />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => { setCurrentTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full py-2 text-sm bg-red-600/90 hover:bg-red-700/90 rounded-lg transition-colors">
            Logout
          </button>
        </div>
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
              <span className="text-blue-400 font-medium">ST</span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-black to-neutral-900/50">
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800/50">
              {error}
              <button onClick={() => setError(null)} className="float-right">
                <FiX size={18} />
              </button>
            </div>
          )}
          
          {currentTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  Student Dashboard
                </h1>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:border-blue-500/30">
                  <h3 className="text-sm text-neutral-400">Applied Internships</h3>
                  <div className="text-2xl md:text-3xl font-bold mt-2">12</div>
                </div>
                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:border-blue-500/30">
                  <h3 className="text-sm text-neutral-400">Active Applications</h3>
                  <div className="text-2xl md:text-3xl font-bold mt-2">5</div>
                </div>
                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:border-blue-500/30">
                  <h3 className="text-sm text-neutral-400">Upcoming Interviews</h3>
                  <div className="text-2xl md:text-3xl font-bold mt-2">2</div>
                </div>
              </div>
              
              {/* Recent Internships */}
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                    Available Internships
                  </h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-8 text-neutral-400">Loading internships...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.length > 0 ? (
                      internships.slice(0, 3).map(renderInternshipCard)
                    ) : (
                      <div className="col-span-full text-center py-8 text-neutral-400">
                        No internships available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {currentTab === 'internships' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  Available Internships
                </h1>
              </div>
              
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
                {loading ? (
                  <div className="text-center py-8 text-neutral-400">Loading internships...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.length > 0 ? (
                      internships.map(renderInternshipCard)
                    ) : (
                      <div className="col-span-full text-center py-8 text-neutral-400">
                        No internships available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {currentTab === 'application' && selectedInternship && (
            <>
              <button 
                onClick={() => setCurrentTab('internships')}
                className="mb-4 flex items-center text-neutral-400 hover:text-white"
              >
                <FiArrowLeft className="mr-1" />
                Back to Internships
              </button>

              <h1 className="text-2xl md:text-3xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                Apply for {selectedInternship.title} at {selectedInternship.company}
              </h1>
              
              {error && (
                <div className="mb-4 p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleApplicationSubmit} className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="mb-4">
                  <label className="block text-neutral-300 mb-2">
                    Resume (PDF only, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-300 mb-2">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={handleApplicationInputChange}
                    className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded"
                    rows="8"
                    placeholder="Explain why you're a good fit for this internship..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('internships')}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </form>
            </>
          )}

          {currentTab === 'profile' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  My Profile
                </h1>
              </div>
              
              <form onSubmit={handleProfileSubmit} className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-neutral-300 mb-2">Skills (comma-separated):</label>
                    <input 
                      type="text" 
                      name="skills" 
                      value={profileData.skills.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "skills")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Interests (comma-separated):</label>
                    <input 
                      type="text" 
                      name="interests" 
                      value={profileData.interests.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "interests")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">CGPA:</label>
                    <input 
                      type="number" 
                      name="cgpa" 
                      value={profileData.cgpa} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                      step="0.1" 
                      min="0" 
                      max="10" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Resume (URL):</label>
                    <input 
                      type="url" 
                      name="resume" 
                      value={profileData.resume} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Achievements (comma-separated):</label>
                    <input 
                      type="text" 
                      name="achievements" 
                      value={profileData.achievements.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "achievements")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Phone Number:</label>
                    <input 
                      type="text" 
                      name="phoneNumber" 
                      value={profileData.phoneNumber} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">LinkedIn Profile:</label>
                    <input 
                      type="url" 
                      name="linkedinProfile" 
                      value={profileData.linkedinProfile} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Portfolio Website:</label>
                    <input 
                      type="url" 
                      name="portfolioWebsite" 
                      value={profileData.portfolioWebsite} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Certifications (comma-separated):</label>
                    <input 
                      type="text" 
                      name="certifications" 
                      value={profileData.certifications.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "certifications")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Availability:</label>
                    <select 
                      name="availability" 
                      value={profileData.availability} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded"
                    >
                      <option value="">Select</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Preferred Roles (comma-separated):</label>
                    <input 
                      type="text" 
                      name="preferredRoles" 
                      value={profileData.preferredRoles.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "preferredRoles")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">Location Preference:</label>
                    <input 
                      type="text" 
                      name="locationPreference" 
                      value={profileData.locationPreference} 
                      onChange={handleProfileChange} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2">References (comma-separated):</label>
                    <input 
                      type="text" 
                      name="references" 
                      value={profileData.references.join(", ")} 
                      onChange={(e) => handleProfileArrayChange(e, "references")} 
                      className="w-full px-3 py-2 bg-neutral-900/70 border border-white/10 text-white rounded" 
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    type="submit" 
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </>
          )}

          {currentTab === 'settings' && (
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl md:text-2xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                Settings
              </h2>
              <p className="text-neutral-400">Settings content will go here</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;