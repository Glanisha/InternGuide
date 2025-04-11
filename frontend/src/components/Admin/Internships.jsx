// src/components/admin/Internships.jsx
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Internships({ 
  setCurrentTab, 
  filteredInternships, 
  loading, 
  searchTerm, 
  handleSearch, 
  handleEdit, 
  handleDelete 
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Manage Internships
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-neutral-400" size={18} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 bg-neutral-900/70 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              placeholder="Search internships..."
            />
          </div>
          <button 
            onClick={() => setCurrentTab('create')}
            className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} />
            Create New
          </button>
        </div>
      </div>
      
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
        {loading ? (
          <div className="text-center py-8 text-neutral-400">Loading internships...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-neutral-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Deadline</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredInternships.map((internship) => (
                  <tr key={internship._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-200">{internship.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.company}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.department}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.applicationDeadline}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.internshipDuration}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(internship)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(internship._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-neutral-800/50 transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}