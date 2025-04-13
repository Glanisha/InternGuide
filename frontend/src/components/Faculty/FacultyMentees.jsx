import { useEffect, useState } from "react";
import axios from "axios";
import Notifications from "./Notifications";

const FacultyMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/faculty/mentees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMentees(response.data.mentees || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch mentees:", err);
        setError("Failed to load mentees.");
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  if (loading) return <p className="text-neutral-400">Loading mentees...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      {mentees.map((mentee, index) => (
        <div
          key={mentee._id || index}
          className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-sm text-white w-full"
        >
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            {mentee.name}
          </h3>

          <div className="grid grid-cols-3 gap-6 text-neutral-200">
            <div className="flex flex-col gap-2">
              <p>
                <span className="text-neutral-400 font-medium">Email:</span>{" "}
                {mentee.email}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Dept:</span>{" "}
                {mentee.department}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">CGPA:</span>{" "}
                {mentee.cgpa}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Phone:</span>{" "}
                {mentee.phoneNumber}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">
                  Availability:
                </span>{" "}
                {mentee.availability}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">
                  Location Pref:
                </span>{" "}
                {mentee.locationPreference}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p>
                <span className="text-neutral-400 font-medium">LinkedIn:</span>{" "}
                <a
                  href={mentee.linkedinProfile}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  {mentee.linkedinProfile}
                </a>
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Portfolio:</span>{" "}
                <a
                  href={mentee.portfolioWebsite}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  {mentee.portfolioWebsite}
                </a>
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Skills:</span>{" "}
                {mentee.skills?.join(", ")}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Interests:</span>{" "}
                {mentee.interests?.join(", ")}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">
                  Certifications:
                </span>{" "}
                {mentee.certifications?.join(", ")}
              </p>
              <p>
                <span className="text-neutral-400 font-medium">Roles:</span>{" "}
                {mentee.preferredRoles?.join(", ")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-neutral-400 font-medium">Achievements:</p>
              <ul className="list-disc ml-5">
                {mentee.achievements?.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>

              {mentee.feedback?.length > 0 && (
                <>
                  <p className="text-neutral-400 font-medium mt-2">Feedback:</p>
                  <ul className="list-disc ml-5">
                    {mentee.feedback.map((fb, i) => (
                      <li key={i}>
                        Mentor: {fb.mentor}, Rating: {fb.rating} ⭐, Comments:{" "}
                        {fb.comments}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {mentee.appliedInternships?.length > 0 && (
            <div className="mt-6">
              <p className="font-medium text-neutral-300 mb-2">
                Applied Internships:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mentee.appliedInternships.map((app, i) => {
                  let bgColor = "bg-white/5";
                  if (app.status === "Accepted") bgColor = "bg-green-500/20";
                  else if (app.status === "Rejected") bgColor = "bg-red-500/20";
                  else if (app.status === "Pending")
                    bgColor = "bg-yellow-500/20";

                  return (
                    <div key={i} className={`${bgColor} p-4 rounded-lg`}>
                      <p className="text-white font-medium">
                        {app.internship?.title || "Unknown"} at{" "}
                        {app.internship?.company || "Unknown"}
                      </p>
                      <p className="text-sm text-neutral-300">
                        Status: {app.status}
                      </p>
                      <p className="text-sm text-neutral-400">
                        Mode: {app.internship?.mode}
                      </p>
                      <p className="text-sm text-neutral-400">
                        Deadline:{" "}
                        {app.internship?.applicationDeadline
                          ? new Date(
                              app.internship.applicationDeadline
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {app.internship?.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all">
              Message
            </button>
          </div>

          
        </div>
      ))}
    </div>
  );
};

export default FacultyMentees;
