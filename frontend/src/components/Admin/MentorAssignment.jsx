import { useState } from 'react';
import axios from 'axios';

export default function MentorAssignment() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'existing'
  const [manualUpdate, setManualUpdate] = useState(null); // {studentId, facultyId}
  const [assignments, setAssignments] = useState(null);
  const [allAssignments, setAllAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/admin/assign', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAssignments(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate assignments');
      console.error('Error generating assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8000/api/admin/confirm-mentors', { 
        assignments: assignments.assignments 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAssignments(null);
      fetchAllAssignments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm assignments');
      console.error('Error confirming assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentChange = (studentId, facultyId) => {
    setAssignments(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [studentId]: facultyId || undefined // Set to undefined if empty string
      }
    }));
  };

  const fetchAllAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentsResponse, facultyResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/students?withMentor=true', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get('/api/faculty', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      setAllAssignments({
        students: studentsResponse.data,
        faculty: facultyResponse.data
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssignment = async (studentId, facultyId) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:8000/api/students/${studentId}/mentor`, { 
        facultyId: facultyId || null 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update assignment');
      console.error('Error updating assignment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualUpdate = async (studentId, facultyId) => {
    try {
      await updateAssignment(studentId, facultyId);
      setManualUpdate(null);
      fetchAllAssignments();
    } catch (err) {
      // Error already handled in updateAssignment
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Mentor Assignment
        </h1>
      </div>
      
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex border-b border-white/10 mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'new' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            New Assignments
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'existing' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => {
              setActiveTab('existing');
              fetchAllAssignments();
            }}
          >
            Existing Assignments
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : activeTab === 'new' ? (
          !assignments ? (
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-medium mb-4">Automatic Mentor Assignment</h2>
              <p className="text-neutral-400 mb-6">
                Assign mentors to students who don't currently have one, based on matching skills, 
                interests, and expertise.
              </p>
              <button 
                onClick={generateAssignments}
                disabled={isLoading}
                className="px-6 py-3 bg-white hover:bg-white/90 text-black rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Run Mentor Assignment Algorithm'}
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl md:text-2xl font-medium mb-6">
                {assignments.message || "Review New Mentor Assignments"}
              </h2>
              
              {assignments.students?.length > 0 ? (
                <>
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
                                  disabled={isLoading}
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
                      disabled={isLoading}
                      className="px-6 py-2 border border-white/20 hover:border-white/40 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmAssignments}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Confirm Assignments'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-neutral-400">No students need mentor assignments at this time.</p>
              )}
            </div>
          )
        ) : (
          <div>
            <h2 className="text-xl md:text-2xl font-medium mb-6">Current Mentor Assignments</h2>
            
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Current Mentor</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allAssignments?.students?.map(student => (
                    <tr key={student._id} className="border-b border-white/10">
                      <td className="py-4">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-neutral-400">
                          Skills: {student.skills?.join(', ')}
                        </div>
                      </td>
                      <td className="py-4">
                        {student.assignedMentor ? (
                          <>
                            <div>{student.assignedMentor.name}</div>
                            <div className="text-sm text-neutral-400">
                              Expertise: {student.assignedMentor.areasOfExpertise?.join(', ')}
                            </div>
                          </>
                        ) : 'Not assigned'}
                      </td>
                      <td className="py-4">
                        {manualUpdate?.studentId === student._id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={manualUpdate.facultyId || ''}
                              onChange={(e) => setManualUpdate({
                                studentId: student._id,
                                facultyId: e.target.value
                              })}
                              className="bg-neutral-800 border border-white/10 rounded px-3 py-1"
                              disabled={isLoading}
                            >
                              <option value="">Remove Mentor</option>
                              {allAssignments.faculty?.map(mentor => (
                                <option key={mentor._id} value={mentor._id}>
                                  {mentor.name} ({mentor.areasOfExpertise?.join(', ')})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleManualUpdate(student._id, manualUpdate.facultyId)}
                              disabled={isLoading}
                              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
                            >
                              {isLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setManualUpdate(null)}
                              disabled={isLoading}
                              className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setManualUpdate({
                              studentId: student._id,
                              facultyId: student.assignedMentor?._id || ''
                            })}
                            disabled={isLoading}
                            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded disabled:opacity-50"
                          >
                            Change Mentor
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}