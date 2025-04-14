import React, { useState } from 'react';
import axios from 'axios';

const ApplicationForm = ({ internship, onClose, onSubmitSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      setError('Resume is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);

      const token = localStorage.getItem('token'); // Assuming you store JWT token here
      
      const response = await axios.post(
        `http://localhost:8000/api/applications/${internship._id}/apply`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onSubmitSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Apply for {internship.title}
            </h2>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Internship Card Preview */}
          <div className="mb-6">
            <div className="bg-neutral-800/50 border border-white/5 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">{internship.company}</h3>
              <p className="text-sm text-neutral-300 mb-4">{internship.title}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                  {internship.mode}
                </span>
                <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                  {internship.department}
                </span>
              </div>

              <p className="text-sm text-neutral-300 mb-2">
                <strong>Location:</strong> {internship.location || 'Remote'}
              </p>
              <p className="text-sm text-neutral-300">
                <strong>Deadline:</strong> {new Date(internship.applicationDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
                rows={5}
                placeholder="Explain why you're a good fit for this position..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Resume (PDF only)
              </label>
              <div className="flex items-center">
                <label className="flex-1 cursor-pointer">
                  <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-neutral-800/50 transition-colors">
                    {resume ? (
                      <p className="text-blue-400">{resume.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-neutral-400">Click to upload resume</p>
                        <p className="text-xs text-neutral-500 mt-1">PDF format, max 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="hidden"
                    accept=".pdf,application/pdf"
                  />
                </label>
                {resume && (
                  <button
                    type="button"
                    onClick={() => setResume(null)}
                    className="ml-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;