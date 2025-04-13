import { useEffect, useState } from "react";
import axios from "axios";

const FacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/faculty/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setProfile(response.data.faculty);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-neutral-400 p-6">Loading profile...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!profile) return <p className="text-neutral-400 p-6">No profile data found</p>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-white">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
          {profile.profilePicture && (
            <img 
              src={profile.profilePicture} 
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-blue-400">{profile.name}</h1>
            <p className="text-neutral-300">{profile.designation}</p>
            <p className="text-neutral-400">{profile.department}</p>
            <div className="flex gap-2 mt-2">
              {profile.linkedInProfile && (
                <a 
                  href={profile.linkedInProfile} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-neutral-800/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">Contact Information</h2>
              <div className="space-y-2">
                {profile.email && (
                  <p>
                    <span className="text-neutral-400 font-medium">Email:</span> {profile.email}
                  </p>
                )}
                {profile.contactNumber && (
                  <p>
                    <span className="text-neutral-400 font-medium">Phone:</span> {profile.contactNumber}
                  </p>
                )}
                {profile.yearOfExperience > 0 && (
                  <p>
                    <span className="text-neutral-400 font-medium">Experience:</span> {profile.yearOfExperience} years
                  </p>
                )}
                <p>
                  <span className="text-neutral-400 font-medium">Mentoring Status:</span>{" "}
                  <span className={profile.isAvailableForMentoring ? "text-green-400" : "text-red-400"}>
                    {profile.isAvailableForMentoring ? "Available" : "Not Available"}
                  </span>
                  {profile.isAvailableForMentoring && (
                    <span className="text-neutral-400 ml-2">(Capacity: {profile.mentoringCapacity})</span>
                  )}
                </p>
              </div>
            </div>

            {/* Qualifications */}
            {profile.qualifications?.length > 0 && (
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">Qualifications</h2>
                <ul className="space-y-3">
                  {profile.qualifications.map((qual, index) => (
                    <li key={index} className="border-l-2 border-blue-500 pl-3">
                      <p className="font-medium">{qual.degree}</p>
                      <p className="text-neutral-300">{qual.institution}</p>
                      <p className="text-neutral-400 text-sm">{qual.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas of Expertise */}
            {profile.areasOfExpertise?.length > 0 && (
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.areasOfExpertise.map((area, index) => (
                    <span key={index} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Research Interests */}
            {profile.researchInterests?.length > 0 && (
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">Research Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.researchInterests.map((interest, index) => (
                    <span key={index} className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {profile.publications?.length > 0 && (
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">Publications</h2>
                <ul className="space-y-3">
                  {profile.publications.map((pub, index) => (
                    <li key={index} className="border-l-2 border-purple-500 pl-3">
                      <p className="font-medium">{pub.title}</p>
                      <p className="text-neutral-300">{pub.journal}</p>
                      <p className="text-neutral-400 text-sm">{pub.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mentoring Information */}
            {(profile.assignedStudents?.length > 0 || profile.internshipsSupervised?.length > 0) && (
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-400 mb-3">Mentoring</h2>
                {profile.assignedStudents?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-neutral-300 mb-2">Assigned Students ({profile.assignedStudents.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {profile.assignedStudents.map(student => (
                        <div key={student._id} className="bg-neutral-700/20 p-2 rounded">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-neutral-400">{student.department} • CGPA: {student.cgpa || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {profile.internshipsSupervised?.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium text-neutral-300 mb-2">Supervised Internships</h3>
                    <div className="space-y-2">
                      {profile.internshipsSupervised.map((internship, index) => (
                        <div key={index} className="bg-neutral-700/20 p-2 rounded">
                          <p className="font-medium">{internship.internship?.title || 'Unknown Internship'}</p>
                          <p className="text-sm text-neutral-400">
                            {internship.students?.length || 0} students • Status: {internship.internship?.status || 'Unknown'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;