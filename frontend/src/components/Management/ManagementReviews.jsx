import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { managementGetReviewsRoute } from '../../utils';

const ManagementReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      const res = await axios.get(managementGetReviewsRoute , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/management/reviews/${id}/status`,
        { status: 'read' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: 'read' } : r
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300 mb-6">
        Student Reviews
      </h1>
      
      <div className="space-y-3">
        {reviews.slice(0, visibleCount).map((review) => (
          <div key={review._id} className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {review.isAnonymous ? 'Anonymous' : review.student?.name || 'Anonymous'}
                  </h2>
                  <p className="text-neutral-400 text-sm">
                    Department: {review.isAnonymous ? 'Hidden' : review.student?.department || 'N/A'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${review.status === 'read' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {review.status === 'read' ? 'Read' : 'Unread'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-pink-400">Strengths: </span>
                  <span className="text-neutral-300">{review.strengths}</span>
                </div>
                <div>
                  <span className="font-medium text-pink-400">Areas for Improvement: </span>
                  <span className="text-neutral-300">{review.areasForImprovement}</span>
                </div>
                <div>
                  <span className="font-medium text-pink-400">Suggestions: </span>
                  <span className="text-neutral-300">{review.suggestions}</span>
                </div>
                {review.additionalComments && (
                  <div>
                    <span className="font-medium text-pink-400">Comments: </span>
                    <span className="text-neutral-300">{review.additionalComments}</span>
                  </div>
                )}
              </div>

              {review.status !== 'read' && (
                <button
                  onClick={() => markAsRead(review._id)}
                  className="mt-3 px-3 py-1 bg-pink-500/10 text-pink-400 rounded-lg text-sm hover:bg-pink-500/20 transition-colors border border-pink-500/30"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <button
          onClick={handleSeeMore}
          className="mt-6 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity mx-auto block"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ManagementReviews;