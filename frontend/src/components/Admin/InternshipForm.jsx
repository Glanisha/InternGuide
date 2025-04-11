import { FiCalendar, FiChevronDown } from 'react-icons/fi';

export default function InternshipForm({ 
  editMode, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  onCancel,
  isSubmitting,
  error
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          {editMode ? 'Edit Internship' : 'Create New Internship'}
        </h1>
      </div>
      
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Department*</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            {/* Requirements */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Requirements*</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Application Deadline*</label>
              <div className="relative">
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                />
                <FiCalendar className="absolute right-3 top-3 text-white/50" />
              </div>
            </div>

            {/* Internship Duration */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Duration*</label>
              <input
                type="text"
                name="internshipDuration"
                value={formData.internshipDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Stipend */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Stipend</label>
              <input
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Mode</label>
              <div className="relative">
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select mode</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-white/50" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SDG Goals */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">SDG Goals</label>
              <input
                type="text"
                name="sdgGoals"
                value={formData.sdgGoals}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Program Outcomes */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Program Outcomes</label>
              <input
                type="text"
                name="programOutcomes"
                value={formData.programOutcomes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Educational Objectives */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Educational Objectives</label>
              <input
                type="text"
                name="educationalObjectives"
                value={formData.educationalObjectives}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800/70 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing...'
              ) : editMode ? (
                'Update Internship'
              ) : (
                'Create Internship'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}