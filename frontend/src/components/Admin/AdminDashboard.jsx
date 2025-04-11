// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApi } from '../../utils';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import Internships from '../components/admin/Internships';
import InternshipForm from '../components/admin/InternshipForm';
import MentorAssignment from '../components/admin/MentorAssignment';
import Settings from '../components/admin/Settings';

// Axios instance setup
const api = axios.create({
  baseURL: baseApi,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default function AdminDashboard() {
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
  const [assignments, setAssignments] = useState(null);

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

  const generateAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/assign', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setAssignments({
        assignments: response.data.assignments || {},
        students: response.data.students || [],
        faculty: response.data.faculty || []
      });
    } catch (error) {
      console.error('Error generating assignments:', error);
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

  const handleAssignmentChange = (studentId, mentorId) => {
    setAssignments(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [studentId]: mentorId || null
      }
    }));
  };

  return (
    <AdminLayout>
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 text-red-300 rounded-lg text-sm border border-red-800/50">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            <FiX size={18} />
          </button>
        </div>
      )}
      
      {currentTab === 'dashboard' && (
        <Dashboard 
          stats={stats}
          setCurrentTab={setCurrentTab}
          filteredInternships={filteredInternships}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {currentTab === 'internships' && (
        <Internships 
          setCurrentTab={setCurrentTab}
          filteredInternships={filteredInternships}
          loading={loading}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {currentTab === 'create' && (
        <InternshipForm 
          editMode={editMode}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setCurrentTab={setCurrentTab}
          setEditMode={setEditMode}
          setFormData={setFormData}
        />
      )}

      {currentTab === 'mentors' && (
        <MentorAssignment 
          assignments={assignments}
          generateAssignments={generateAssignments}
          confirmAssignments={confirmAssignments}
          setAssignments={setAssignments}
          handleAssignmentChange={handleAssignmentChange}
        />
      )}

      {currentTab === 'settings' && <Settings />}
    </AdminLayout>
  );
}