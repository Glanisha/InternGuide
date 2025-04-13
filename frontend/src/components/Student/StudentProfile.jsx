import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data);
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) return <div className="text-center p-8 text-neutral-400">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-400">{error}</div>;
  if (!student) return <div className="text-center p-8 text-neutral-400">No profile data found</div>;

  return (
    <div className="bg-neutral-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-white">My Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Personal Information</h3>
            <div className="space-y-2 text-neutral-300">
              <p><span className="text-neutral-400 font-medium">Name:</span> {student.name}</p>
              <p><span className="text-neutral-400 font-medium">Email:</span> {student.email}</p>
              <p><span className="text-neutral-400 font-medium">Department:</span> {student.department}</p>
              <p><span className="text-neutral-400 font-medium">CGPA:</span> {student.cgpa || 'Not specified'}</p>
              <p><span className="text-neutral-400 font-medium">Phone:</span> {student.phoneNumber || 'Not specified'}</p>
              <p><span className="text-neutral-400 font-medium">Availability:</span> {student.availability || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Professional Details</h3>
            <div className="space-y-2 text-neutral-300">
              <p>
                <span className="text-neutral-400 font-medium">LinkedIn:</span> 
                {student.linkedinProfile ? (
                  <a href={student.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                    {student.linkedinProfile}
                  </a>
                ) : ' Not specified'}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Portfolio:</span> 
                {student.portfolioWebsite ? (
                  <a href={student.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                    {student.portfolioWebsite}
                  </a>
                ) : ' Not specified'}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Resume:</span> 
                {student.resume ? (
                  <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                    View Resume
                  </a>
                ) : ' Not uploaded'}
              </p>
              <p><span className="text-neutral-400 font-medium">Location Preference:</span> {student.locationPreference || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Skills & Interests</h3>
            <div className="space-y-2 text-neutral-300">
              <p>
                <span className="text-neutral-400 font-medium">Skills:</span> 
                {student.skills?.length > 0 ? student.skills.join(', ') : 'Not specified'}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Interests:</span> 
                {student.interests?.length > 0 ? student.interests.join(', ') : 'Not specified'}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Preferred Roles:</span> 
                {student.preferredRoles?.length > 0 ? student.preferredRoles.join(', ') : 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Achievements & Certifications</h3>
            <div className="space-y-2 text-neutral-300">
              <p>
                <span className="text-neutral-400 font-medium">Certifications:</span> 
                {student.certifications?.length > 0 ? student.certifications.join(', ') : 'None'}
              </p>
              {student.achievements?.length > 0 && (
                <div>
                  <p className="text-neutral-400 font-medium mb-1">Achievements:</p>
                  <ul className="list-disc pl-5">
                    {student.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {student.assignedMentor && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Mentor</h3>
              <div className="text-neutral-300">
                <p>{student.assignedMentor.name}</p>
                <p className="text-sm text-neutral-400">{student.assignedMentor.department}</p>
                <p className="text-sm text-neutral-400">{student.assignedMentor.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;