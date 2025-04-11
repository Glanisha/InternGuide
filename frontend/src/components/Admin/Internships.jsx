import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, FiArrowLeft } from 'react-icons/fi';
import InternshipForm from './InternshipForm';

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create axios instance with auth headers
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  // Initial form data state
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch all internships on component mount
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await api.get('/internships');
        setInternships(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch internships');
        console.error('Error fetching internships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Filter internships based on search term and filters
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter ? 
      internship.department.toLowerCase().includes(departmentFilter.toLowerCase()) : true;

    return matchesSearch && matchesDepartment;
  });

  // Handle delete internship
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    
    try {
      await api.delete(`/internships/delete/${id}`);
      setInternships(internships.filter(i => i._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete internship');
      console.error('Error deleting internship:', err);
    }
  };

  // Handle edit internship - navigate to edit form
  const handleEdit = (internship) => {
    setCurrentInternship(internship);
    setFormData({
      title: internship.title,
      company: internship.company,
      description: internship.description,
      requirements: internship.requirements,
      department: internship.department,
      sdgGoals: internship.sdgGoals,
      programOutcomes: internship.programOutcomes,
      educationalObjectives: internship.educationalObjectives,
      applicationDeadline: internship.applicationDeadline,
      internshipDuration: internship.internshipDuration,
      stipend: internship.stipend,
      location: internship.location,
      mode: internship.mode,
      role: internship.role
    });
    setEditMode(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (currentInternship) {
        // Update existing internship
        await api.put(
          `/internships/update/${currentInternship._id}`,
          formData
        );
      } else {
        // Create new internship
        await api.post(
          '/internships',
          formData
        );
      }
      
      // Refresh the internships list
      const response = await api.get('/internships');
      setInternships(response.data);
      
      // Reset form and exit edit mode
      setFormData(initialFormData);
      setEditMode(false);
      setCurrentInternship(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save internship');
      console.error('Error saving internship:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentInternship(null);
    setFormData(initialFormData);
  };

  if (editMode) {
    return (
      <div className="p-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Internships
        </button>

        <InternshipForm 
          editMode={!!currentInternship}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Manage Internships
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-neutral-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search internships..."
              className="pl-10 pr-4 py-2 bg-neutral-900/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2 text-sm"
          >
            <FiFilter size={16} />
            Filters
          </button>
          
          <button 
            onClick={() => {
              setEditMode(true);
              setCurrentInternship(null);
              setFormData(initialFormData);
            }}
            className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} />
            Create New
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Department</label>
              <input
                type="text"
                placeholder="Filter by department"
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Internships table */}
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-neutral-400">Loading internships...</div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            {internships.length === 0 ? 'No internships available' : 'No internships match your filters'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredInternships.map((internship) => (
                  <tr key={internship._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-200">{internship.title}</div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {internship.internshipDuration} • {internship.stipend || 'Unpaid'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(internship)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded hover:bg-neutral-800/50 transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(internship._id)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-neutral-800/50 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
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
    </div>
  );
};

export default AdminInternships;