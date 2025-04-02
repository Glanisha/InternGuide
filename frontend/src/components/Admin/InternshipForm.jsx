export default function InternshipForm({
    formData,
    handleInputChange,
    handleSubmit,
    editMode,
    setCurrentTab,
    setEditMode,
    setFormData
  }) {
    return (
      <GlassCard>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields remain the same as in your original code */}
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
                  internshipDuration: ''
                });
              }}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
            >
              {editMode ? 'Update Internship' : 'Create Internship'}
            </button>
          </div>
        </form>
      </GlassCard>
    );
  }