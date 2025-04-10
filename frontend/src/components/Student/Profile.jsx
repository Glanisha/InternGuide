import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    skills: [],
    interests: [],
    cgpa: '',
    resume: '',
    achievements: [],
    phoneNumber: '',
    linkedinProfile: '',
    portfolioWebsite: '',
    certifications: [],
    availability: '',
    preferredRoles: [],
    locationPreference: '',
    references: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/student/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, fieldName) => {
    const { value } = e.target;
    const arrayValue = value.split(',').map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [fieldName]: arrayValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/api/student/update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
        My Profile
      </h2>
      <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Skills', 'skills'],
              ['Interests', 'interests'],
              ['Achievements', 'achievements'],
              ['Certifications', 'certifications'],
              ['Preferred Roles', 'preferredRoles'],
              ['References', 'references'],
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-sm text-neutral-300 mb-1">{label} (comma-separated):</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name].join(', ')}
                  onChange={(e) => handleArrayChange(e, name)}
                  className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm text-neutral-300 mb-1">CGPA:</label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full p-3 rounded-lg bg-neutral-800 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
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
              <label className="block text-sm text-neutral-300 mb-1">Location Preference:</label>
              <input
                type="text"
                name="locationPreference"
                value={formData.locationPreference}
                onChange={handleChange}
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
  );
};

export default Profile;
