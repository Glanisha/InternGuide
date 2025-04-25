import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HurryUpApply = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/internships', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const processedInternships = response.data
          .filter(internship => {
            const deadlineDate = new Date(internship.applicationDeadline);
            return internship.status === 'Open' && deadlineDate >= now;
          })
          .map(internship => ({
            ...internship,
            deadline: new Date(internship.applicationDeadline),
            isUrgent: new Date(internship.applicationDeadline) <= oneWeekFromNow
          }))
          .sort((a, b) => a.deadline - b.deadline);

        setInternships(processedInternships);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-white mb-2">No Open Internships</h3>
        <p className="text-neutral-400">There are currently no internships available.</p>
      </div>
    );
  }

  const internshipsToDisplay = showAll ? internships : internships.slice(0, 3);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-2">Hurry Up & Apply</h2>
      <p className="text-neutral-400 mb-6">These opportunities are closing soon. Don't miss out!</p>

      <div className="space-y-3">
        {internshipsToDisplay.map((internship) => (
          <div
            key={internship._id}
            className={`bg-neutral-900/50 backdrop-blur-sm border rounded-xl p-4 transition-all ${
              internship.isUrgent
                ? 'border-green-500/30 hover:border-green-500/50'
                : 'border-white/10 hover:border-blue-500/30'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-white">{internship.title}</h3>
                <p className="text-sm text-neutral-300">{internship.company}</p>
              </div>
              {internship.isUrgent && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  Closing Soon
                </span>
              )}
            </div>

            <p className="text-sm text-white mb-4 line-clamp-2">{internship.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-neutral-400">Deadline</p>
                <p
                  className={`font-medium ${
                    internship.isUrgent ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {formatDate(internship.deadline)}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Duration</p>
                <p className="text-white">{internship.internshipDuration}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {internship.requirements.slice(0, 3).map((req, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-neutral-800 rounded-md text-neutral-300"
                  >
                    {req}
                  </span>
                ))}
                {internship.requirements.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-neutral-800 rounded-md text-neutral-500">
                    +{internship.requirements.length - 3} more
                  </span>
                )}
              </div>

              <Link
                to={`/student/internships`}
                className="px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
              >
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!showAll && internships.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default HurryUpApply;
