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
    skills: [],
    interests: [],
    preferredRoles: [],
    certifications: [],
    achievements: [],
    newSkill: '',
    newInterest: '',
    newPreferredRole: '',
    newCertification: '',
    newAchievement: ''
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
          skills: student.skills || [],
          interests: student.interests || [],
          preferredRoles: student.preferredRoles || [],
          certifications: student.certifications || [],
          achievements: student.achievements || [],
          newSkill: '',
          newInterest: '',
          newPreferredRole: '',
          newCertification: '',
          newAchievement: ''
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

  const handleAddItem = (field) => {
    const newItem = formData[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem.trim()],
        [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        linkedinProfile: formData.linkedinProfile,
        portfolioWebsite: formData.portfolioWebsite,
        resume: formData.resume,
        cgpa: formData.cgpa,
        availability: formData.availability,
        locationPreference: formData.locationPreference,
        skills: formData.skills,
        interests: formData.interests,
        preferredRoles: formData.preferredRoles,
        certifications: formData.certifications,
        achievements: formData.achievements
      };

      await axios.put('http://localhost:8000/api/student/update', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
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

        {/* Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-neutral-400 mb-1">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newSkill}
                onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                placeholder="Add new skill"
              />
              <button
                type="button"
                onClick={() => handleAddItem('skills')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="bg-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('skills', index)}
                      className="ml-2 text-neutral-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="block text-neutral-400 mb-1">Interests</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newInterest}
                onChange={(e) => setFormData({...formData, newInterest: e.target.value})}
                className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                placeholder="Add new interest"
              />
              <button
                type="button"
                onClick={() => handleAddItem('interests')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests.map((interest, index) => (
                  <div key={index} className="bg-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('interests', index)}
                      className="ml-2 text-neutral-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Roles */}
          <div className="space-y-2">
            <label className="block text-neutral-400 mb-1">Preferred Roles</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newPreferredRole}
                onChange={(e) => setFormData({...formData, newPreferredRole: e.target.value})}
                className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                placeholder="Add new role"
              />
              <button
                type="button"
                onClick={() => handleAddItem('preferredRoles')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            {formData.preferredRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredRoles.map((role, index) => (
                  <div key={index} className="bg-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('preferredRoles', index)}
                      className="ml-2 text-neutral-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <label className="block text-neutral-400 mb-1">Certifications</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newCertification}
                onChange={(e) => setFormData({...formData, newCertification: e.target.value})}
                className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                placeholder="Add new certification"
              />
              <button
                type="button"
                onClick={() => handleAddItem('certifications')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="bg-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                    {cert}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('certifications', index)}
                      className="ml-2 text-neutral-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <label className="block text-neutral-400 mb-1">Achievements</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.newAchievement}
              onChange={(e) => setFormData({...formData, newAchievement: e.target.value})}
              className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="Add new achievement"
            />
            <button
              type="button"
              onClick={() => handleAddItem('achievements')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
          {formData.achievements.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between bg-neutral-800 rounded-lg px-3 py-2">
                  <span>{achievement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('achievements', index)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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