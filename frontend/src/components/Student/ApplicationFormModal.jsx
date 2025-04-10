import React, { useState } from 'react';

const ApplicationFormModal = ({ isOpen, onClose, onSubmit, internshipTitle }) => {
  const [resume, setResume] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(resume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-neutral-900 border border-white/10 rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">
          Apply to {internshipTitle}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 text-white rounded"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormModal;
