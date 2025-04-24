import React from 'react';

const CoverLetterModal = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-medium">Cover Letter</h3>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterModal;