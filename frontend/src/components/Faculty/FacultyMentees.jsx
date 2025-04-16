import { useEffect, useState } from "react";
import axios from "axios";

const FacultyMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState({
    mentees: true,
    feedback: false
  });
  const [error, setError] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);

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
      } catch (err) {
        console.error("Failed to fetch mentees:", err);
        setError("Failed to load mentees.");
      } finally {
        setLoading(prev => ({ ...prev, mentees: false }));
      }
    };

    fetchMentees();
  }, []);

  if (loading.mentees) return <p className="text-neutral-400">Loading mentees...</p>;
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
        // Skip card if internship title or company is missing
        if (!app.internship?.title || !app.internship?.company) return null;

        let bgColor = "bg-white/5";
        if (app.status === "Accepted") bgColor = "bg-green-500/20";
        else if (app.status === "Rejected") bgColor = "bg-red-500/20";
        else if (app.status === "Pending") bgColor = "bg-yellow-500/20";

        return (
          <div key={i} className={`${bgColor} p-4 rounded-lg`}>
            <p className="text-white font-medium">
              {app.internship.title} at {app.internship.company}
            </p>
            <p className="text-sm text-neutral-300">
              Status: {app.status}
            </p>
            <p className="text-sm text-neutral-400">
              Mode: {app.internship.mode}
            </p>
            <p className="text-sm text-neutral-400">
              Deadline:{" "}
              {app.internship.applicationDeadline
                ? new Date(app.internship.applicationDeadline).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm text-neutral-400">
              {app.internship.description}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}


          <div className="flex justify-end gap-4 pt-6">
            <button 
              onClick={() => setSelectedMentee(mentee)}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Give Feedback
            </button>
            <button className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all">
              Message
            </button>
          </div>
        </div>
      ))}

      {selectedMentee && (
        <FeedbackDialog 
          mentee={selectedMentee} 
          onClose={() => setSelectedMentee(null)}
        />
      )}
    </div>
  );
};

const FeedbackDialog = ({ mentee, onClose }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState({
    feedback: false,
    submitting: false,
    replying: false
  });
  const [error, setError] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchFacultyFeedback = async () => {
      try {
        setLoading(prev => ({ ...prev, feedback: true }));
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/feedback/faculty",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Filter feedback for this specific student
        const studentFeedback = response.data.filter(
          fb => fb.student?._id === mentee._id
        );
        setFeedbackHistory(studentFeedback);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setError("Failed to load feedback history");
      } finally {
        setLoading(prev => ({ ...prev, feedback: false }));
      }
    };

    fetchFacultyFeedback();
  }, [mentee._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter feedback message");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/feedback",
        {
          studentId: mentee._id,
          message,
          rating,
          isPrivate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFeedbackHistory([response.data, ...feedbackHistory]);
      setMessage("");
      setRating(3);
      setIsPrivate(false);
      setError(null);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleReplySubmit = async (feedbackId) => {
    if (!replyMessage.trim()) {
      setError("Please enter a reply message");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, replying: true }));
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/feedback/reply",
        {
          feedbackId,
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFeedbackHistory(
        feedbackHistory.map(fb => 
          fb._id === feedbackId ? response.data : fb
        )
      );
      setReplyMessage("");
      setReplyingTo(null);
      setError(null);
    } catch (err) {
      console.error("Failed to submit reply:", err);
      setError(err.response?.data?.message || "Failed to submit reply");
    } finally {
      setLoading(prev => ({ ...prev, replying: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Feedback for {mentee.name}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-neutral-400 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg p-3 text-white"
                rows={4}
                disabled={loading.submitting}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-3 text-white"
                  disabled={loading.submitting}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} ⭐
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2"
                  disabled={loading.submitting}
                />
                <label htmlFor="private" className="text-neutral-400">
                  Private Feedback
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading.submitting}
            >
              {loading.submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-lg font-medium mb-4">Feedback History</h4>

          {loading.feedback ? (
            <p className="text-neutral-400">Loading feedback...</p>
          ) : feedbackHistory.length === 0 ? (
            <p className="text-neutral-400">No feedback given yet</p>
          ) : (
            <div className="space-y-4">
              {feedbackHistory.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-neutral-800/50 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{feedback.message}</p>
                      <p className="text-sm text-neutral-400 mt-1">
                        {new Date(feedback.createdAt).toLocaleString()} •{" "}
                        {feedback.isPrivate && (
                          <span className="text-yellow-400">Private</span>
                        )}
                      </p>
                    </div>
                    {feedback.rating && (
                      <div className="text-yellow-400 text-lg">
                        {feedback.rating} ⭐
                      </div>
                    )}
                  </div>

                  {feedback.replies?.length > 0 && (
                    <div className="mt-3 pl-4 border-l border-white/10 space-y-3">
                      {feedback.replies.map((reply, i) => (
                        <div key={i}>
                          <p className="text-sm">
                            <span className="font-medium">
                              {reply.sender === "faculty" ? "You" : mentee.name}:
                            </span>{" "}
                            {reply.message}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyingTo === feedback._id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 bg-neutral-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                        disabled={loading.replying}
                      />
                      <button
                        onClick={() => handleReplySubmit(feedback._id)}
                        className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading.replying}
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(feedback._id)}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Reply
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyMentees;