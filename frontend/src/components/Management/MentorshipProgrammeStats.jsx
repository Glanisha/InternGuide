import React, { useEffect, useState } from "react";
import axios from "axios";
import {reviewStatsRoute} from "../../utils"; // Adjust the import path as necessary

const MentorshipProgrammeStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        reviewStatsRoute,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStats(response.data.analytics);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!stats) return null;

  // Helper function to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={
            i <= Math.round(rating) ? "text-yellow-400" : "text-neutral-600"
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300 mb-8">
        Mentorship Programme Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-neutral-400 text-sm font-medium">
            Total Reviews
          </h3>
          <p className="text-3xl font-bold text-white mt-2">
            {stats.totalReviews}
          </p>
        </div>

        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-neutral-400 text-sm font-medium">
            Overall Experience
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold text-white mr-2">
              {stats.averageOverallExperience.toFixed(1)}
            </span>
            <div className="text-lg">
              {renderStars(stats.averageOverallExperience)}
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-neutral-400 text-sm font-medium">
            Mentorship Quality
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold text-white mr-2">
              {stats.averageMentorshipRating.toFixed(1)}
            </span>
            <div className="text-lg">
              {renderStars(stats.averageMentorshipRating)}
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-neutral-400 text-sm font-medium">
            Industry Relevance
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold text-white mr-2">
              {stats.averageIndustryRelevanceRating.toFixed(1)}
            </span>
            <div className="text-lg">
              {renderStars(stats.averageIndustryRelevanceRating)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-8 text-white font-medium">{rating}★</span>
                <div className="flex-1 bg-neutral-800 rounded-full h-4 mx-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                    style={{
                      width: `${
                        (stats.ratingDistribution[rating] /
                          stats.totalReviews) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-neutral-400 text-sm w-10 text-right">
                  {stats.ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SDG Alignment */}
        <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">
            SDG Alignment
          </h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white mr-4">
              {stats.averageSdgAlignmentRating.toFixed(1)}
            </span>
            <div className="text-2xl">
              {renderStars(stats.averageSdgAlignmentRating)}
            </div>
          </div>
          <p className="text-neutral-400 text-sm mt-3">
            Average rating for alignment with Sustainable Development Goals
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipProgrammeStats;
