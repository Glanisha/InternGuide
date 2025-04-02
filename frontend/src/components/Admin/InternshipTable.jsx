import { Edit, Trash } from 'lucide-react';

export default function InternshipTable({ internships, handleEdit, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 bg-opacity-30">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {internships.map((internship) => (
            <tr key={internship._id} className="hover:bg-gray-800 hover:bg-opacity-30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">{internship.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{internship.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">{internship.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">{internship.applicationDeadline}</td>
              <td className="px-6 py-4 whitespace-nowrap">{internship.internshipDuration}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(internship)}
                    className="p-1 text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(internship._id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}