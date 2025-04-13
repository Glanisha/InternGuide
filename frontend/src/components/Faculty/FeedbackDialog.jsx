import { useState } from "react";
import axios from "axios";

const FeedbackDialog = ({ mentee, onClose, onFeedbackSubmit }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // Fetch feedback history when component mounts
  useState(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/feedback/student/${mentee._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedbackHistory(response.data.feedback || []);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      }
    };
    fetchFeedback();
  }, [mentee._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter feedback message");
      return;
    }

    try {
      setLoading(true);
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

      // Update feedback history
      setFeedbackHistory([response.data, ...feedbackHistory]);
      setMessage("");
      setRating(3);
      setIsPrivate(false);
      setError(null);
      if (onFeedbackSubmit) onFeedbackSubmit();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (feedbackId) => {
    if (!replyMessage.trim()) {
      setError("Please enter a reply message");
      return;
    }

    try {
      setLoading(true);
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

      // Update the specific feedback in history
      setFeedbackHistory(
        feedbackHistory.map((fb) =>
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
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Feedback for {mentee.name}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
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
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <label htmlFor="private" className="text-neutral-400">
                  Private Feedback
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-lg font-medium mb-4">Feedback History</h4>

          {feedbackHistory.length === 0 ? (
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
                        Rating: {feedback.rating} ⭐ •{" "}
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
                        disabled={loading}
                      />
                      <button
                        onClick={() => handleReplySubmit(feedback._id)}
                        className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
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

export default FeedbackDialog;