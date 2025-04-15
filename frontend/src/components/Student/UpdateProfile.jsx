import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phoneNumber: '',
    linkedinProfile: '',
    portfolioWebsite: '',
    resume: '',
    cgpa: '',
    availability: '',
    locationPreference: '',
    skills: '',
    interests: '',
    preferredRoles: '',
    certifications: '',
    achievements: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const student = response.data;
        setFormData({
          name: student.name || '',
          email: student.email || '',
          department: student.department || '',
          phoneNumber: student.phoneNumber || '',
          linkedinProfile: student.linkedinProfile || '',
          portfolioWebsite: student.portfolioWebsite || '',
          resume: student.resume || '',
          cgpa: student.cgpa || '',
          availability: student.availability || '',
          locationPreference: student.locationPreference || '',
          skills: student.skills?.join(', ') || '',
          interests: student.interests?.join(', ') || '',
          preferredRoles: student.preferredRoles?.join(', ') || '',
          certifications: student.certifications?.join(', ') || '',
          achievements: student.achievements?.join(', ') || ''
        });
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      // Convert comma-separated strings back to arrays
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
        preferredRoles: formData.preferredRoles.split(',').map(s => s.trim()).filter(s => s),
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        achievements: formData.achievements.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await axios.put(
        'http://localhost:8000/api/student/update',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-neutral-400">Loading profile data...</div>;

  return (
    <div className="bg-neutral-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Update Profile</h2>
      
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Personal Information</h3>
            
            <div>
              <label className="block text-neutral-400 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">CGPA</label>
              <input
                type="number"
                name="cgpa"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Professional Information</h3>
            
            <div>
              <label className="block text-neutral-400 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Portfolio Website</label>
              <input
                type="url"
                name="portfolioWebsite"
                value={formData.portfolioWebsite}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Resume URL</label>
              <input
                type="url"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Select availability</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-neutral-400 mb-1">Location Preference</label>
              <input
                type="text"
                name="locationPreference"
                value={formData.locationPreference}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Lists as comma-separated inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-neutral-400 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="JavaScript, Python, React"
            />
          </div>
          
          <div>
            <label className="block text-neutral-400 mb-1">Interests (comma separated)</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="Web Development, AI, UX Design"
            />
          </div>
          
          <div>
            <label className="block text-neutral-400 mb-1">Preferred Roles (comma separated)</label>
            <input
              type="text"
              name="preferredRoles"
              value={formData.preferredRoles}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="Frontend Developer, Data Analyst"
            />
          </div>
          
          <div>
            <label className="block text-neutral-400 mb-1">Certifications (comma separated)</label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="AWS Certified, Google Analytics"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-neutral-400 mb-1">Achievements (comma separated)</label>
            <input
              type="text"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="Hackathon winner, Published paper"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;