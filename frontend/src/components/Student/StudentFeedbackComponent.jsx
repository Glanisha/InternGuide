import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentFeedbackComponent = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState({
    feedback: false,
    replying: false
  });
  const [error, setError] = useState(null);

  // Fetch feedback for the current student
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(prev => ({ ...prev, feedback: true }));
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/feedback/student',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedbackList(response.data || []);
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load feedback. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, feedback: false }));
      }
    };

    fetchFeedback();
  }, []);

  const handleReplySubmit = async (feedbackId) => {
    if (!replyMessage.trim()) {
      setError('Please enter a reply message');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, replying: true }));
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/feedback/reply',
        {
          feedbackId,
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update the feedback list with the new reply
      setFeedbackList(prevList =>
        prevList.map(feedback =>
          feedback._id === feedbackId ? response.data : feedback
        )
      );
      
      setReplyMessage('');
      setReplyingTo(null);
      setError(null);
    } catch (err) {
      console.error('Failed to submit reply:', err);
      setError(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setLoading(prev => ({ ...prev, replying: false }));
    }
  };

  return (
    <div className="bg-neutral-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Feedback from Your Mentor</h2>
      
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading.feedback ? (
        <div className="text-center py-8">
          <p className="text-neutral-400">Loading feedback...</p>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-400">No feedback received yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbackList.map((feedback) => (
            <div key={feedback._id} className="bg-neutral-800/50 border border-white/10 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg text-white">
                    From: {feedback.faculty?.name || 'Your Mentor'}
                  </h3>
                  <p className="text-neutral-300 mt-2">{feedback.message}</p>
                  <div className="flex items-center mt-3 text-sm text-neutral-400">
                    {feedback.rating && (
                      <span className="flex items-center mr-4">
                        <span className="text-yellow-400 mr-1">{feedback.rating}</span>
                        <span>⭐</span>
                      </span>
                    )}
                    <span>
                      {new Date(feedback.createdAt).toLocaleString()}
                    </span>
                    {feedback.isPrivate && (
                      <span className="ml-4 text-yellow-400">Private</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies section */}
              {feedback.replies?.length > 0 && (
                <div className="mt-4 pl-4 border-l border-white/10 space-y-4">
                  <h4 className="text-sm font-medium text-neutral-400">Conversation:</h4>
                  {feedback.replies.map((reply, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-medium text-white">
                        {reply.sender === 'faculty' ? 
                          (feedback.faculty?.name || 'Mentor') : 
                          'You'}:
                      </p>
                      <p className="text-neutral-300 mt-1">{reply.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === feedback._id ? (
                <div className="mt-4">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full bg-neutral-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    rows={3}
                    disabled={loading.replying}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReplySubmit(feedback._id)}
                      className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                      disabled={loading.replying}
                    >
                      {loading.replying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(feedback._id)}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Reply to Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFeedbackComponent;