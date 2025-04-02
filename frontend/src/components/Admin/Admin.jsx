import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Briefcase, Users, Settings, X, Menu as MenuIcon, Plus, Edit, Trash, Search } from 'react-feather';

// Axios instance setup
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    department: '',
    sdgGoals: '',
    programOutcomes: '',
    educationalObjectives: '',
    applicationDeadline: '',
    internshipDuration: '',
    stipend: '',
    location: '',
    mode: '',
    role: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Fetch internships on component mount
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await api.get('/internships');
        
        if (response.data && Array.isArray(response.data)) {
          setInternships(response.data);
          setFilteredInternships(response.data);
        } else {
          setError('Unexpected response format from server');
          setInternships([]);
          setFilteredInternships([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch internships');
        setInternships([]);
        setFilteredInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Filter internships based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInternships(internships);
    } else {
      const filtered = internships.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInternships(filtered);
    }
  }, [searchTerm, internships]);

  // Stats data
  const stats = {
    totalStudents: 742,
    totalMentors: 138,
    activeInternships: internships?.length || 0,
    ongoingInternships: 18
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update existing internship
        const response = await api.put(
          `/internships/update/${currentId}`,
          formData
        );
        setInternships(internships.map(item => 
          item._id === currentId ? response.data : item
        ));
      } else {
        // Create new internship
        const response = await api.post('/internships', formData);
        setInternships([...internships, response.data]);
      }
      
      // Reset form and state
      setFormData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        department: '',
        sdgGoals: '',
        programOutcomes: '',
        educationalObjectives: '',
        applicationDeadline: '',
        internshipDuration: '',
        stipend: '',
        location: '',
        mode: '',
        role: ''
      });
      setEditMode(false);
      setCurrentId(null);
      setCurrentTab('internships');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  const handleEdit = (internship) => {
    setFormData({
      title: internship.title,
      company: internship.company,
      description: internship.description,
      requirements: internship.requirements?.join(', ') || '',
      department: internship.department,
      sdgGoals: internship.sdgGoals?.join(', ') || '',
      programOutcomes: internship.programOutcomes?.join(', ') || '',
      educationalObjectives: internship.educationalObjectives?.join(', ') || '',
      applicationDeadline: internship.applicationDeadline,
      internshipDuration: internship.internshipDuration,
      stipend: internship.stipend || '',
      location: internship.location || '',
      mode: internship.mode || '',
      role: internship.role || ''
    });
    setEditMode(true);
    setCurrentId(internship._id);
    setCurrentTab('create');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/internships/delete/${id}`);
      setInternships(internships.filter(item => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete internship');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar - Mobile */}
      <div className={`lg:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-70" onClick={toggleSidebar}></div>
        <nav className="relative z-50 flex flex-col w-64 bg-gray-900 bg-opacity-80 backdrop-blur-lg border-r border-gray-800 p-4 transform transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Admin Portal</h1>
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800">
              <X size={24} />
            </button>
          </div>
          {renderNavItems()}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <button className="w-full px-4 py-2 bg-red-600/90 hover:bg-red-700/90 rounded-md transition-colors flex items-center justify-center gap-2">
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900/80 backdrop-blur-lg border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Admin Portal</h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {renderNavItems()}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 bg-red-600/90 hover:bg-red-700/90 rounded-md transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
          {error && (
            <div className="col-span-12 bg-red-900/50 text-red-200 p-4 mb-4 rounded-lg backdrop-blur-sm">
              {error}
              <button onClick={() => setError(null)} className="float-right">
                <X size={18} />
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {currentTab === 'dashboard' && (
              <>
                <h1 className="col-span-12 text-3xl md:text-4xl font-bold mb-6">Admin Dashboard</h1>
                {/* Stats Cards */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                  <StatCard title="Total Students" value={stats.totalStudents} color="from-blue-400 to-blue-600" />
                  <StatCard title="Total Mentors" value={stats.totalMentors} color="from-purple-400 to-purple-600" />
                  <StatCard title="Active Internships" value={stats.activeInternships} color="from-green-400 to-green-600" />
                  <StatCard title="Ongoing Internships" value={stats.ongoingInternships} color="from-yellow-400 to-yellow-600" />
                </div>
                
                {/* Recent Internships */}
                <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Internships</h2>
                    <button 
                      onClick={() => setCurrentTab('create')}
                      className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors flex items-center gap-2 text-sm"
                    >
                      <Plus size={16} />
                      Add New
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center py-8">Loading internships...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deadline</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {filteredInternships.map((internship) => (
                            <tr key={internship._id} className="hover:bg-gray-900/50 transition-colors">
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.title}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.company}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.department}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.applicationDeadline}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.internshipDuration}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleEdit(internship)}
                                    className="p-1 text-blue-400 hover:text-blue-300 rounded hover:bg-gray-800/50"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(internship._id)}
                                    className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-gray-800/50"
                                  >
                                    <Trash size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentTab === 'internships' && (
              <>
                <div className="col-span-12 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold">Manage Internships</h1>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="block w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Search internships..."
                      />
                    </div>
                    <button 
                      onClick={() => setCurrentTab('create')}
                      className="px-4 py-2 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={18} />
                      Create New
                    </button>
                  </div>
                </div>
                
                <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deadline</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredInternships.map((internship) => (
                          <tr key={internship._id} className="hover:bg-gray-900/50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.title}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.company}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.department}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.applicationDeadline}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">{internship.internshipDuration}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEdit(internship)}
                                  className="p-1 text-blue-400 hover:text-blue-300 rounded hover:bg-gray-800/50"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(internship._id)}
                                  className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-gray-800/50"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {currentTab === 'create' && (
              <>
                <div className="col-span-12 mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {editMode ? 'Edit Internship' : 'Create New Internship'}
                  </h1>
                </div>
                
                <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Application Deadline</label>
                        <input
                          type="date"
                          name="applicationDeadline"
                          value={formData.applicationDeadline}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Internship Duration</label>
                        <input
                          type="text"
                          name="internshipDuration"
                          value={formData.internshipDuration}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g. 3 months"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Stipend</label>
                        <input
                          type="text"
                          name="stipend"
                          value={formData.stipend}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g. $4500/month"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Mode</label>
                        <input
                          type="text"
                          name="mode"
                          value={formData.mode}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g. Onsite, Remote, or Hybrid"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g. UI/UX Designer Intern"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">SDG Goals</label>
                        <input
                          type="text"
                          name="sdgGoals"
                          value={formData.sdgGoals}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Comma separated goals"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        ></textarea>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Requirements</label>
                        <textarea
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter requirements separated by commas"
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Program Outcomes</label>
                        <textarea
                          name="programOutcomes"
                          value={formData.programOutcomes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter program outcomes separated by commas"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Educational Objectives</label>
                        <textarea
                          name="educationalObjectives"
                          value={formData.educationalObjectives}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter educational objectives separated by commas"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('internships');
                          setEditMode(false);
                          setFormData({
                            title: '',
                            company: '',
                            description: '',
                            requirements: '',
                            department: '',
                            sdgGoals: '',
                            programOutcomes: '',
                            educationalObjectives: '',
                            applicationDeadline: '',
                            internshipDuration: '',
                            stipend: '',
                            location: '',
                            mode: '',
                            role: ''
                          });
                        }}
                        className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 rounded-md transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors text-sm"
                      >
                        {editMode ? 'Update Internship' : 'Create Internship'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {currentTab === 'mentors' && (
              <>
                <div className="col-span-12 mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold">Mentor Assignment</h1>
                </div>
                
                <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Automatic Mentor Assignment</h2>
                    <p className="text-gray-400 mb-6">
                      Assign mentors to students based on matching skills, interests, and expertise.
                      This process uses AI to find the best matches for optimal learning outcomes.
                    </p>
                    <button className="px-6 py-3 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors">
                      Run Mentor Assignment Algorithm
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  function renderNavItems() {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
      { id: 'internships', label: 'Internships', icon: <Briefcase size={20} /> },
      { id: 'mentors', label: 'Mentor Assignment', icon: <Users size={20} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => {
                setCurrentTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                currentTab === item.id 
                  ? 'bg-gray-800 text-white font-medium' 
                  : 'hover:bg-gray-800/50 text-gray-300'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 transition-all hover:border-gray-700 hover:shadow-lg hover:shadow-blue-500/10">
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}