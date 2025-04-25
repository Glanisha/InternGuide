import React, { useState, useEffect } from 'react';

const ViewerInternshipCard = ({ internship, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if this internship is already saved
  useEffect(() => {
    const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');
    setIsSaved(savedInternships.some(item => item._id === internship._id));
  }, [internship._id]);

  const formatArray = (arr) => arr && arr.length > 0 ? arr.join(', ') : 'N/A';
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

  const handleSave = () => {
    const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedInternships.filter(item => item._id !== internship._id);
      localStorage.setItem('savedInternships', JSON.stringify(updated));
    } else {
      // Add to saved
      localStorage.setItem('savedInternships', JSON.stringify([...savedInternships, internship]));
    }
    
    setIsSaved(!isSaved);
    if (onSave) onSave();
  };

  return (
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
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSave}
        className={`w-full mt-4 py-2 text-sm rounded-lg transition-all ${
          isSaved 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-white/5 hover:bg-white/10 text-white'
        }`}
      >
        {isSaved ? 'Saved ✓' : 'Save Internship'}
      </button>
    </div>
  );
};

export default ViewerInternshipCard;