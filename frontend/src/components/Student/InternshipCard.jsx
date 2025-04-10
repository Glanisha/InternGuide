import React from 'react';

const InternshipCard = ({ internship, onApply }) => {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
      <div className="flex items-start mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <span className="text-blue-400 font-medium">
            {internship.company.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-white">{internship.company}</h3>
          <p className="text-sm text-neutral-300">{internship.title}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 my-3">
        <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
          {internship.mode}
        </span>
        <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
          {internship.department}
        </span>
        {internship.skillsRequired?.slice(0, 2).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Duration</span>
          <span className="text-white">{internship.internshipDuration}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Stipend</span>
          <span className="text-white">₹{internship.stipend || 'Not specified'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button 
          className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          onClick={() => {/* View details action */}}
        >
          Details
        </button>
        <button 
          className="flex-1 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
          onClick={() => onApply(internship._id)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;