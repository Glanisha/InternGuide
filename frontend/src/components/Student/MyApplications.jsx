import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/applications/my-applications',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data);
        
        // Filter out applications where internship is null or undefined
        const validApplications = response.data.filter(app => app.internship);
        setFilteredApplications(validApplications);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'bg-neutral-800 text-neutral-300';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'accepted':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-neutral-800 text-neutral-300';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleViewResume = (application) => {
    if (!application?.resume) {
      setError('No resume available for this application');
      return;
    }
    setSelectedApplication(application);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  if (filteredApplications.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-8 text-center">
        <h3 className="text-lg font-medium text-white mb-2">
          {applications.length === 0 ? 'No Applications Found' : 'No Active Applications'}
        </h3>
        <p className="text-neutral-400">
          {applications.length === 0 
            ? 'You haven\'t applied to any internships yet.' 
            : 'All your applications are for internships that have been deleted.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-6">My Applications</h2>
      
      {filteredApplications.map((application) => (
        <div 
          key={application._id} 
          className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all"
        >
          {/* Company and Title */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-white">
                {application.internship.company}
              </h3>
              <p className="text-sm text-neutral-300">
                {application.internship.title}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-white mb-4 line-clamp-2">
            {application.internship.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-neutral-400">Application Date</p>
              <p className="text-white">{formatDate(application.applicationDate)}</p>
            </div>
            <div>
              <p className="text-neutral-400">Internship Status</p>
              <p className="text-white">
                {application.internship.status}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleViewResume(application)}
              className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              disabled={!application?.resume}
            >
              {application?.resume ? 'View Resume' : 'No Resume'}
            </button>
          </div>

          {/* Cover Letter Preview */}
          {application.coverLetter && (
            <div className="mt-4">
              <p className="text-sm text-neutral-400 mb-1">Cover Letter:</p>
              <p className="text-sm text-white line-clamp-2">
                {application.coverLetter}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Resume Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Uploaded Resume</h3>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-neutral-800/50 border border-dashed border-white/20 rounded-lg p-8 text-center">
              {selectedApplication.resume ? (
                <>
                  <p className="text-blue-400 mb-2">
                    {selectedApplication.resume.split('\\').pop()}
                  </p>
                  <p className="text-sm text-neutral-400 mb-4">
                    For: {selectedApplication.internship.title} at {selectedApplication.internship.company}
                  </p>
                  <div className="mt-4 space-x-3">
                    <a 
                      href={`http://localhost:8000/${selectedApplication.resume.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                    >
                      Download Resume
                    </a>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-red-400">No resume available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;