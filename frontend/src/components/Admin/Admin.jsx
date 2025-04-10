import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApi } from '../../utils';
import { FiMenu, FiX, FiHome, FiBriefcase, FiUsers, FiSettings, FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown, FiCalendar } from 'react-icons/fi';

// Axios instance setup
const api = axios.create({
  baseURL: baseApi,
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

  const [assignments, setAssignments] = useState(null);
  const generateAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/assign', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token
        }
      });
      
      setAssignments({
        assignments: response.data.assignments || {},
        students: response.data.students || [],
        faculty: response.data.faculty || []
      });
    } catch (error) {
      console.error('Error generating assignments:', error);
      // Show error to user
      alert('Failed to generate assignments. Please check your authentication.');
    }
  };
  
  const confirmAssignments = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/admin/confirm-mentors',
        { assignments: assignments.assignments },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setAssignments(null);
      alert('Mentor assignments confirmed successfully!');
    } catch (error) {
      console.error('Error confirming assignments:', error);
      alert('Failed to confirm assignments.');
    }
  };


  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-neutral-900/70 backdrop-blur-sm border-r border-white/10 z-30 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Admin Portal
          </h1>
          <button 
            onClick={toggleSidebar} 
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
            onClick={() => { setCurrentTab('mentors'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentTab === 'mentors' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-300 hover:bg-white/5'}`}
          >
            <FiUsers size={20} />
            <span>Mentor Assignment</span>
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
            onClick={toggleSidebar} 
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-neutral-400">Admin</p>
              <p className="font-medium">Dashboard</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-medium">AD</span>
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
                  Admin Dashboard
                </h1>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  title="Total Students" 
                  value={stats.totalStudents} 
                  icon={<FiUsers size={24} className="text-blue-400" />}
                />
                <StatCard 
                  title="Total Mentors" 
                  value={stats.totalMentors} 
                  icon={<FiUsers size={24} className="text-purple-400" />}
                />
                <StatCard 
                  title="Active Internships" 
                  value={stats.activeInternships} 
                  icon={<FiBriefcase size={24} className="text-green-400" />}
                />
                <StatCard 
                  title="Ongoing Internships" 
                  value={stats.ongoingInternships} 
                  icon={<FiBriefcase size={24} className="text-yellow-400" />}
                />
              </div>
              
              {/* Recent Internships */}
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                    Recent Internships
                  </h2>
                  <button 
                    onClick={() => setCurrentTab('create')}
                    className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FiPlus size={16} />
                    Add New
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8 text-neutral-400">Loading internships...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-neutral-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Deadline</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredInternships.slice(0, 5).map((internship) => (
                          <tr key={internship._id} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-200">{internship.title}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.company}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.department}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.applicationDeadline}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.internshipDuration}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEdit(internship)}
                                  className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(internship._id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                                >
                                  <FiTrash2 size={16} />
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  Manage Internships
                </h1>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-neutral-400" size={18} />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 bg-neutral-900/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                      placeholder="Search internships..."
                    />
                  </div>
                  <button 
                    onClick={() => setCurrentTab('create')}
                    className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FiPlus size={16} />
                    Create New
                  </button>
                </div>
              </div>
              
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
                {loading ? (
                  <div className="text-center py-8 text-neutral-400">Loading internships...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-neutral-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Deadline</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredInternships.map((internship) => (
                          <tr key={internship._id} className="hover:bg-neutral-800/30 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-200">{internship.title}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.company}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.department}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.applicationDeadline}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.internshipDuration}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEdit(internship)}
                                  className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(internship._id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                                >
                                  <FiTrash2 size={16} />
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

          {currentTab === 'create' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                  {editMode ? 'Edit Internship' : 'Create New Internship'}
                </h1>
              </div>
              
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Application Deadline</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="applicationDeadline"
                          value={formData.applicationDeadline}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white pr-10"
                          required
                        />
                        <FiCalendar className="absolute right-3 top-2.5 text-neutral-400" size={18} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Internship Duration</label>
                      <input
                        type="text"
                        name="internshipDuration"
                        value={formData.internshipDuration}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="e.g. 3 months"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Stipend</label>
                      <input
                        type="text"
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="e.g. $4500/month"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Mode</label>
                      <div className="relative">
                        <select
                          name="mode"
                          value={formData.mode}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white appearance-none"
                        >
                          <option value="">Select Mode</option>
                          <option value="Onsite">Onsite</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="e.g. UI/UX Designer Intern"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">SDG Goals</label>
                      <input
                        type="text"
                        name="sdgGoals"
                        value={formData.sdgGoals}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="Comma separated goals"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Requirements</label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="Enter requirements separated by commas"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Program Outcomes</label>
                      <textarea
                        name="programOutcomes"
                        value={formData.programOutcomes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
                        placeholder="Enter program outcomes separated by commas"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-300">Educational Objectives</label>
                      <textarea
                        name="educationalObjectives"
                        value={formData.educationalObjectives}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-neutral-900/70 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white"
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
                      className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg transition-colors text-sm"
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
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
        Mentor Assignment
      </h1>
    </div>
    
    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-8">
      {!assignments ? (
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-medium mb-4">Automatic Mentor Assignment</h2>
          <p className="text-neutral-400 mb-6">
            Assign mentors to students based on matching skills, interests, and expertise.
            This process uses AI to find the best matches for optimal learning outcomes.
          </p>
          <button 
            onClick={generateAssignments}
            className="px-6 py-3 bg-white hover:bg-white/90 text-black rounded-lg transition-colors"
          >
            Run Mentor Assignment Algorithm
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-6">Review Mentor Assignments</h2>
          
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Assigned Mentor</th>
                  <th className="pb-3">Change</th>
                </tr>
              </thead>
              <tbody>
                {assignments.students?.map(student => {
                  const assignedMentor = assignments.faculty?.find(f => f._id === assignments.assignments[student._id]);
                  return (
                    <tr key={student._id} className="border-b border-white/10">
                      <td className="py-4">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-neutral-400">
                          Skills: {student.skills?.join(', ')}
                        </div>
                      </td>
                      <td className="py-4">
                        {assignedMentor ? (
                          <>
                            <div>{assignedMentor.name}</div>
                            <div className="text-sm text-neutral-400">
                              Expertise: {assignedMentor.areasOfExpertise?.join(', ')}
                            </div>
                          </>
                        ) : 'Not assigned'}
                      </td>
                      <td className="py-4">
                        <select 
                          value={assignments.assignments[student._id] || ''}
                          onChange={(e) => handleAssignmentChange(student._id, e.target.value)}
                          className="bg-neutral-800 border border-white/10 rounded px-3 py-1"
                        >
                          <option value="">Select Mentor</option>
                          {assignments.faculty?.map(mentor => (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.name} ({mentor.areasOfExpertise?.join(', ')})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setAssignments(null)}
              className="px-6 py-2 border border-white/20 hover:border-white/40 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmAssignments}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Confirm Assignments
            </button>
          </div>
        </div>
      )}
    </div>
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
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:border-blue-500/30">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-neutral-400">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}