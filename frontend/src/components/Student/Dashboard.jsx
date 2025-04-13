import React, { useEffect, useState } from 'react';
import InternshipCard from './InternshipCard';
import axios from 'axios';
import { getBestInternshipRoute } from '../../utils';
import StudentMentorView from './StudentMentorView';
import StudentReport from './StudentReport';
import StudentProfile from './StudentProfile';
import UpdateProfile from './UpdateProfile';

const Dashboard = () => {
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  useEffect(() => {
    const fetchRecommendedInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(getBestInternshipRoute, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setRecommendedInternships(response.data || []);
      } catch (error) {
        console.error("Error fetching recommended internships:", error);
        setRecommendedInternships([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedInternships();
  }, []);

  const applyForInternship = async (internshipId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/student/apply/${internshipId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Error applying for internship.");
    }
  };

  const toggleUpdateProfile = () => {
    setShowUpdateProfile(!showUpdateProfile);
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-6">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
          <p className="text-neutral-400">No upcoming events</p>
        </div>
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Recent Applications</h3>
          <p className="text-neutral-400">No recent applications</p>
        </div>
      </div>

      <StudentProfile />
      
      {/* Add Update Profile button */}
      <button 
        onClick={toggleUpdateProfile}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mb-6 transition-colors"
      >
        {showUpdateProfile ? 'Hide Update Form' : 'Update Profile'}
      </button>
      
      {/* Conditionally render UpdateProfile */}
      {showUpdateProfile && <UpdateProfile />}
    </div>
  );
};

export default Dashboard;