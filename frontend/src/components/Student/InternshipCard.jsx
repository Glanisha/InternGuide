import React from 'react';
import { useState } from 'react';
import ApplicationForm from './ApplicationForm'; 


const InternshipCard = ({ internship}) => {

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(null);
  const formatArray = (arr) =>
    arr && arr.length > 0 ? arr.join(', ') : 'N/A';

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

  const handleApplySuccess = (response) => {
    setApplicationSuccess(response);
    setTimeout(() => setApplicationSuccess(null), 5000); 
  };
  return (
    <>
      <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
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

      {/* Buttons */}
      <div className="mt-4 flex space-x-2">
          <button 
            className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            onClick={() => {}}
          >
            Details
          </button>
          <button 
            className="flex-1 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
            onClick={() => setShowApplicationForm(true)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {applicationSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-900/70 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg shadow-lg z-50">
          Application submitted successfully!
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm
          internship={internship}
          onClose={() => setShowApplicationForm(false)}
          onSubmitSuccess={handleApplySuccess}
        />
      )}
    </>
  );
};

export default InternshipCard;

