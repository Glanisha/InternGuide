import StatCard from './StatCard';
import GlassCard from './GlassCard';
import { Plus } from 'lucide-react';

export default function DashboardPage({ stats, internships, setCurrentTab, handleEdit, handleDelete }) {
  return (
    <>
      <h1 className="col-span-12 text-4xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents} color="from-blue-400 to-blue-600" />
        <StatCard title="Total Mentors" value={stats.totalMentors} color="from-purple-400 to-purple-600" />
        <StatCard title="Active Internships" value={stats.activeInternships} color="from-green-400 to-green-600" />
        <StatCard title="Ongoing Internships" value={stats.ongoingInternships} color="from-yellow-400 to-yellow-600" />
      </div>
      
      <GlassCard className="col-span-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Internships</h2>
          <button 
            onClick={() => setCurrentTab('create')}
            className="px-3 py-1 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
        <InternshipTable 
          internships={internships}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </GlassCard>
    </>
  );
}