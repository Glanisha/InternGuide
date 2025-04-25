import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, FiArrowLeft, FiUsers, FiMail } from 'react-icons/fi';
import InternshipForm from './InternshipForm';
import CoverLetterModal from './CoverLetterModal';

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
  const [viewingApplications, setViewingApplications] = useState(false);
  const [currentApplications, setCurrentApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

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
    role: '',
    email: '' // Added email field to form data
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

  // Fetch applications for a specific internship
  const fetchApplications = async (internshipId) => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/internship/${internshipId}`);
      setCurrentApplications(response.data);
      setViewingApplications(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // View full application details
  const viewApplicationDetails = async (applicationId) => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/admin/${applicationId}/full`);
      setSelectedApplication(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch application details');
      console.error('Error fetching application details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setLoading(true);
      await api.patch(`/applications/admin/${applicationId}/status`, { status });
      // Refresh the applications list
      const response = await api.get(`/applications/internship/${selectedApplication.internship._id}`);
      setCurrentApplications(response.data);
      // Also update the selected application if it's the one being viewed
      if (selectedApplication && selectedApplication._id === applicationId) {
        const updatedApp = response.data.find(app => app._id === applicationId);
        setSelectedApplication(updatedApp);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update application status');
      console.error('Error updating application status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send application to company via email
  const sendApplicationToCompany = async () => {
    if (!selectedApplication) return;
    
    try {
      setEmailSending(true);
      
      // Get all internships and find the one we need
      const internshipsResponse = await api.get('/internships');
      const internshipWithEmail = internshipsResponse.data.find(
        i => i._id === selectedApplication.internship._id
      );
      
      if (!internshipWithEmail) {
        throw new Error('Internship not found');
      }
      
      if (!internshipWithEmail.email) {
        throw new Error('Company email not found for this internship');
      }

      // Create email content
      const emailContent = `
        <h2>New Internship Application</h2>
        <p>You have received a new application for the position of <strong>${selectedApplication.internship.title}</strong> at <strong>${selectedApplication.internship.company}</strong>.</p>
        
        <h3>Applicant Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${selectedApplication.student.name}</li>
          <li><strong>Email:</strong> ${selectedApplication.student.email}</li>
          <li><strong>Department:</strong> ${selectedApplication.student.department}</li>
          <li><strong>CGPA:</strong> ${selectedApplication.student.cgpa || 'Not specified'}</li>
          <li><strong>Skills:</strong> ${selectedApplication.student.skills?.join(', ') || 'Not specified'}</li>
        </ul>
        
        <h3>Application Documents:</h3>
        <ul>
          <li><a href="${selectedApplication.resume}" target="_blank">View Resume</a></li>
          ${selectedApplication.coverLetter ? `<li>Cover Letter: ${selectedApplication.coverLetter}</li>` : ''}
        </ul>
        
        <p>Please review this application at your earliest convenience.</p>
        
        <p>Best regards,<br>Internship Portal Team</p>
      `;

      // Send email
      await axios.post('http://localhost:8001/sendEmail', {
        email: internshipWithEmail.email,
        text: emailContent,
        subject: `New Application for ${selectedApplication.internship.title} Position`
      });

      alert('Application sent to company successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send email');
      console.error('Error sending email:', err);
    } finally {
      setEmailSending(false);
    }
  };

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
      role: internship.role,
      email: internship.email // Include email in form data
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

  const handleBackToInternships = () => {
    setViewingApplications(false);
    setSelectedApplication(null);
  };

  const handleBackToApplications = () => {
    setSelectedApplication(null);
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

  if (selectedApplication) {
    return (
      <div className="p-6">
        <button
          onClick={handleBackToApplications}
          className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Applications
        </button>

        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-medium mb-6">
            Application for {selectedApplication.internship.title} at {selectedApplication.internship.company}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Application Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-400">Status</p>
                  <p className="capitalize">{selectedApplication.status.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Application Date</p>
                  <p>{new Date(selectedApplication.applicationDate).toLocaleString()}</p>
                </div>
                {selectedApplication.decisionDate && (
                  <div>
                    <p className="text-sm text-neutral-400">Decision Date</p>
                    <p>{new Date(selectedApplication.decisionDate).toLocaleString()}</p>
                  </div>
                )}
                {selectedApplication.feedback?.fromAdmin && (
                  <div>
                    <p className="text-sm text-neutral-400">Admin Feedback</p>
                    <p>{selectedApplication.feedback.fromAdmin}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Documents</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-400">Resume</p>
                  <a 
                    href={selectedApplication.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
                {selectedApplication.coverLetter && (
                  <div>
                    <p className="text-sm text-neutral-400">Cover Letter</p>
                    <button
                      onClick={() => setShowCoverLetterModal(true)}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      View Cover Letter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/50 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-neutral-400">Name</p>
                <p>{selectedApplication.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Email</p>
                <p>{selectedApplication.student.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Department</p>
                <p>{selectedApplication.student.department}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">CGPA</p>
                <p>{selectedApplication.student.cgpa || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Phone</p>
                <p>{selectedApplication.student.phoneNumber || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Skills</p>
                <p>{selectedApplication.student.skills?.join(', ') || 'Not specified'}</p>
              </div>
              {selectedApplication.student.linkedinProfile && (
                <div>
                  <p className="text-sm text-neutral-400">LinkedIn</p>
                  <a 
                    href={selectedApplication.student.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updateApplicationStatus(selectedApplication._id, 'Accepted')}
              className={`px-4 py-2 rounded-lg ${selectedApplication.status === 'Accepted' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={selectedApplication.status === 'Accepted'}
            >
              Accept
            </button>
            <button
              onClick={() => updateApplicationStatus(selectedApplication._id, 'Rejected')}
              className={`px-4 py-2 rounded-lg ${selectedApplication.status === 'Rejected' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
              disabled={selectedApplication.status === 'Rejected'}
            >
              Reject
            </button>
            <button
              onClick={() => updateApplicationStatus(selectedApplication._id, 'Under Review')}
              className={`px-4 py-2 rounded-lg ${selectedApplication.status === 'Under Review' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={selectedApplication.status === 'Under Review'}
            >
              Mark as Under Review
            </button>
            <button
              onClick={sendApplicationToCompany}
              className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center gap-2 ${emailSending ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={emailSending}
            >
              <FiMail size={16} />
              {emailSending ? 'Sending...' : `Send to ${selectedApplication.internship.company}`}
            </button>
          </div>
        </div>

        {showCoverLetterModal && (
          <CoverLetterModal
            content={selectedApplication.coverLetter}
            onClose={() => setShowCoverLetterModal(false)}
          />
        )}
      </div>
    );
  }

  if (viewingApplications) {
    return (
      <div className="p-6">
        <button
          onClick={handleBackToInternships}
          className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Internships
        </button>

        <h2 className="text-2xl font-medium mb-6">
          Applications for {currentApplications[0]?.internship?.title || 'Internship'}
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-neutral-400">Loading applications...</div>
          ) : currentApplications.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              No applications found for this internship
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-neutral-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-200">{application.student.name}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {application.student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {application.student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'Accepted' ? 'bg-green-900/50 text-green-400' :
                          application.status === 'Rejected' ? 'bg-red-900/50 text-red-400' :
                          application.status === 'Under Review' ? 'bg-blue-900/50 text-blue-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewApplicationDetails(application._id)}
                          className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                        >
                          View Details
                        </button>
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
                        <button
                          onClick={() => fetchApplications(internship._id)}
                          className="text-green-400 hover:text-green-300 p-1.5 rounded hover:bg-neutral-800/50 transition-all"
                          title="View Applications"
                        >
                          <FiUsers size={18} />
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