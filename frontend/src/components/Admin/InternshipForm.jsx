// src/components/admin/InternshipForm.jsx
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

export default function InternshipForm({ 
  editMode, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  setCurrentTab, 
  setEditMode, 
  setFormData 
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          {editMode ? 'Edit Internship' : 'Create New Internship'}
        </h1>
      </div>
      
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* All the form fields from the original component */}
            {/* ... */}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setCurrentTab('internships');
                setEditMode(false);
                setFormData({
                  title: '',
                  company: '',
                  description: '',
                  requirements: '',
                  department: '',
                  sdgGoals: '',
                  programOutcomes: '',
                  educationalObjectives: '',
                  applicationDeadline: '',
                  internshipDuration: '',
                  stipend: '',
                  location: '',
                  mode: '',
                  role: ''
                });
              }}
              className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg transition-colors text-sm"
            >
              {editMode ? 'Update Internship' : 'Create Internship'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}