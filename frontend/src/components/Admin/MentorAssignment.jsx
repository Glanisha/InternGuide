// src/components/admin/MentorAssignment.jsx
export default function MentorAssignment({ 
    assignments, 
    generateAssignments, 
    confirmAssignments, 
    setAssignments,
    handleAssignmentChange 
  }) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            Mentor Assignment
          </h1>
        </div>
        
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          {!assignments ? (
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-medium mb-4">Automatic Mentor Assignment</h2>
              <p className="text-neutral-400 mb-6">
                Assign mentors to students based on matching skills, interests, and expertise.
                This process uses AI to find the best matches for optimal learning outcomes.
              </p>
              <button 
                onClick={generateAssignments}
                className="px-6 py-3 bg-white hover:bg-white/90 text-black rounded-lg transition-colors"
              >
                Run Mentor Assignment Algorithm
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl md:text-2xl font-medium mb-6">Review Mentor Assignments</h2>
              
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Assigned Mentor</th>
                      <th className="pb-3">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.students?.map(student => {
                      const assignedMentor = assignments.faculty?.find(f => f._id === assignments.assignments[student._id]);
                      return (
                        <tr key={student._id} className="border-b border-white/10">
                          <td className="py-4">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-neutral-400">
                              Skills: {student.skills?.join(', ')}
                            </div>
                          </td>
                          <td className="py-4">
                            {assignedMentor ? (
                              <>
                                <div>{assignedMentor.name}</div>
                                <div className="text-sm text-neutral-400">
                                  Expertise: {assignedMentor.areasOfExpertise?.join(', ')}
                                </div>
                              </>
                            ) : 'Not assigned'}
                          </td>
                          <td className="py-4">
                            <select 
                              value={assignments.assignments[student._id] || ''}
                              onChange={(e) => handleAssignmentChange(student._id, e.target.value)}
                              className="bg-neutral-800 border border-white/10 rounded px-3 py-1"
                            >
                              <option value="">Select Mentor</option>
                              {assignments.faculty?.map(mentor => (
                                <option key={mentor._id} value={mentor._id}>
                                  {mentor.name} ({mentor.areasOfExpertise?.join(', ')})
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setAssignments(null)}
                  className="px-6 py-2 border border-white/20 hover:border-white/40 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAssignments}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Confirm Assignments
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }