import { useEffect, useState } from "react";
import axios from "axios";

const StudentMentorView = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/student/mentordetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMentor(response.data.mentor);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch mentor details:", err);
        setError(err.response?.data?.message || "Failed to load mentor details.");
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, []);

  if (loading) return <p className="text-neutral-400">Loading mentor details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!mentor) return <p className="text-neutral-400">No mentor assigned yet.</p>;

  return (
    <div className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-sm text-white w-full">
      <h3 className="text-2xl font-semibold text-blue-400 mb-6">
        Your Faculty Mentor: {mentor.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-neutral-200">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-neutral-400 font-medium">Email:</p>
            <p>{mentor.email}</p>
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Department:</p>
            <p>{mentor.department}</p>
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Designation:</p>
            <p>{mentor.designation || "Not specified"}</p>
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Years of Experience:</p>
            <p>{mentor.yearOfExperience || "Not specified"}</p>
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Contact Number:</p>
            <p>{mentor.contactNumber || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">LinkedIn Profile:</p>
            {mentor.linkedInProfile ? (
              <a 
                href={mentor.linkedInProfile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {mentor.linkedInProfile}
              </a>
            ) : (
              <p>Not provided</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-neutral-400 font-medium">Areas of Expertise:</p>
            {mentor.areasOfExpertise?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {mentor.areasOfExpertise.map((area, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            ) : (
              <p>Not specified</p>
            )}
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Research Interests:</p>
            {mentor.researchInterests?.length > 0 ? (
              <ul className="list-disc ml-5 mt-1">
                {mentor.researchInterests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>Not specified</p>
            )}
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Qualifications:</p>
            {mentor.qualifications?.length > 0 ? (
              <ul className="list-disc ml-5 mt-1">
                {mentor.qualifications.map((qual, index) => (
                  <li key={index}>
                    {qual.degree} from {qual.institution} ({qual.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Not specified</p>
            )}
          </div>
          
          <div>
            <p className="text-neutral-400 font-medium">Publications:</p>
            {mentor.publications?.length > 0 ? (
              <ul className="list-disc ml-5 mt-1">
                {mentor.publications.map((pub, index) => (
                  <li key={index}>
                    "{pub.title}" in {pub.journal} ({pub.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No publications listed</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
       
       
      </div>
    </div>
  );
};

export default StudentMentorView;