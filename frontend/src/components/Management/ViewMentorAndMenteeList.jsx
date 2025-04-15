import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewMentorAndMenteeList = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMentor, setExpandedMentor] = useState(null);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/management/faculty', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setFacultyList(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch faculty data');
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  const toggleMentorExpansion = (id) => {
    if (expandedMentor === id) {
      setExpandedMentor(null);
    } else {
      setExpandedMentor(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300 mb-6">
        Mentor and Mentee List
      </h1>
      
      <div className="space-y-4">
        {facultyList.map((faculty) => (
          <div key={faculty._id} className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div 
              className="p-5 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-colors"
              onClick={() => toggleMentorExpansion(faculty._id)}
            >
              <div>
                <h2 className="text-lg font-semibold text-white">{faculty.name}</h2>
                <p className="text-neutral-400 text-sm">{faculty.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-neutral-300">Department: {faculty.department}</span>
                  <span className="text-sm font-medium">
                    <span className="text-pink-400">{faculty.assignedStudents.length}</span>
                    <span className="text-neutral-400">/{faculty.mentoringCapacity}</span>
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${faculty.isAvailableForMentoring ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {faculty.isAvailableForMentoring ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-neutral-400 transform transition-transform ${expandedMentor === faculty._id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expandedMentor === faculty._id && (
              <div className="border-t border-white/10 px-5 py-4">
                <h3 className="text-md font-medium text-white mb-3">
                  Assigned Students <span className="text-neutral-400">({faculty.assignedStudents.length})</span>
                </h3>
                
                {faculty.assignedStudents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {faculty.assignedStudents.map((student) => (
                      <div key={student._id} className="bg-neutral-800/50 rounded-lg p-4 border border-white/10 hover:border-pink-500/30 transition-colors">
                        <h4 className="font-medium text-white">{student.name}</h4>
                        <p className="text-sm text-neutral-400">{student.email}</p>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-neutral-300">Dept: {student.department}</span>
                          <span className={`font-medium ${student.cgpa >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                            CGPA: {student.cgpa || 'N/A'}
                          </span>
                        </div>
                        
                        {student.skills?.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs text-neutral-400">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.skills.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="bg-pink-500/10 text-pink-400 text-xs px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {student.achievements?.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs text-neutral-400">Achievements:</span>
                            <ul className="mt-1 space-y-1">
                              {student.achievements.map((achievement, index) => (
                                <li 
                                  key={index} 
                                  className="text-xs text-neutral-300 before:content-['•'] before:mr-1 before:text-pink-400"
                                >
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 italic text-sm">No students assigned to this mentor.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMentorAndMenteeList;