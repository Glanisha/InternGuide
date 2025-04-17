import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getBestInternshipRoute } from '../../utils';
import MyApplications from './MyApplications';
import HurryUpApply from './HurryUpApply';
import StudentReviews from './StudentReviews';

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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      {/* Hurry Up & Apply Section */}
      <div className="bg-neutral-900/70 rounded-xl p-6 border border-white/10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Opportunities Knocking</h2>
          <p className="text-neutral-400">Time-sensitive internships you don't want to miss</p>
        </div>
        <HurryUpApply />
      </div>

      <StudentReviews/>

      {/* My Applications Section */}
      <div className="bg-neutral-900/70 rounded-xl p-6 border border-white/10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Your Applications</h2>
          <p className="text-neutral-400">Track the status of your submitted applications</p>
        </div>
        <MyApplications />
      </div>

     
    </div>
  );
};

export default Dashboard;