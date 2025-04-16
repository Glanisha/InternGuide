import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InternshipCard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/internships');
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const formatArray = (arr) =>
    arr && arr.length > 0 ? arr.join(', ') : 'N/A';

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

  if (loading) {
    return <p className="text-white">Loading internships...</p>;
  }

  if (internships.length === 0) {
    return <p className="text-white">No internships available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {internships.map((internship) => (
        <div key={internship._id} className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
          {/* Company Logo and Title */}
          <div className="flex items-start mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <span className="text-blue-400 font-medium">
                {internship.company?.charAt(0) || 'N'}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-white">{internship.company || 'N/A'}</h3>
              <p className="text-sm text-neutral-300">{internship.title || 'N/A'}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 my-3">
            <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
              {internship.mode || 'N/A'}
            </span>
            <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
              {internship.department || 'N/A'}
            </span>
            {internship.skillsRequired?.slice(0, 2).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>

          {/* Description & Role */}
          <p className="text-sm text-white mb-2"><strong>Role:</strong> {internship.title || 'N/A'}</p>
          <p className="text-sm text-white mb-2"><strong>Description:</strong> {internship.description || 'N/A'}</p>

          {/* Duration & Stipend */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">Duration</span>
              <span className="text-white">{internship.internshipDuration || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">Stipend</span>
              <span className="text-white">₹{internship.stipend || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">Deadline</span>
              <span className="text-white">{formatDate(internship.applicationDeadline)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">Location</span>
              <span className="text-white">{internship.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">Status</span>
              <span className="text-white">{internship.status || 'N/A'}</span>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-4 text-sm text-white space-y-2">
            <div>
              <strong>Requirements:</strong> {formatArray(internship.requirements)}
            </div>
            <div>
              <strong>SDG Goals:</strong> {formatArray(internship.sdgGoals)}
            </div>
            <div>
              <strong>Program Outcomes:</strong> {formatArray(internship.programOutcomes)}
            </div>
            <div>
              <strong>Educational Objectives:</strong> {formatArray(internship.educationalObjectives)}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default InternshipCard;