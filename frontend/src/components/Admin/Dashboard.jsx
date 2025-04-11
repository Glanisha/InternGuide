// src/components/admin/Dashboard.jsx
import { FiPlus, FiUsers, FiBriefcase, FiEdit2, FiTrash2 } from 'react-icons/fi';
import StatsCard from './StatsCard';

export default function Dashboard({ 
  stats = {
    totalStudents: 0,
    totalMentors: 0,
    activeInternships: 0,
    ongoingInternships: 0
  }, 
  setCurrentTab = () => {}, 
  filteredInternships = [], 
  loading = false, 
  handleEdit = () => {}, 
  handleDelete = () => {} 
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<FiUsers size={24} className="text-blue-400" />}
        />
        <StatsCard 
          title="Total Mentors" 
          value={stats.totalMentors} 
          icon={<FiUsers size={24} className="text-purple-400" />}
        />
        <StatsCard 
          title="Active Internships" 
          value={stats.activeInternships} 
          icon={<FiBriefcase size={24} className="text-green-400" />}
        />
        <StatsCard 
          title="Ongoing Internships" 
          value={stats.ongoingInternships} 
          icon={<FiBriefcase size={24} className="text-yellow-400" />}
        />
      </div>
      
      {/* Recent Internships */}
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Recent Internships
          </h2>
          <button 
            onClick={() => setCurrentTab('create')}
            className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-lg flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} />
            Add New
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-neutral-400">Loading internships...</div>
        ) : filteredInternships.length > 0 ? (
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
                {filteredInternships.slice(0, 5).map((internship) => (
                  <tr key={internship._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-200">{internship.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.company}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{internship.department}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </td>
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
        ) : (
          <div className="text-center py-8 text-neutral-400">No internships found</div>
        )}
      </div>
    </>
  );
}