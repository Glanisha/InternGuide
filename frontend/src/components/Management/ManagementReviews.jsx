import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagementReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // your Bearer token

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/management/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
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

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Student Reviews</h2>
      {reviews.slice(0, visibleCount).map((review) => (
        <div
          key={review._id}
          className="border rounded-lg p-4 mb-4 shadow bg-white"
        >
          <h3 className="text-lg font-bold">
            {review.isAnonymous ? 'Anonymous' : review.student.name}
          </h3>
          <p className="text-sm text-gray-600">
            Department: {review.isAnonymous ? 'Hidden' : review.student.department}
          </p>
          <p className="mt-2"><strong>Strengths:</strong> {review.strengths}</p>
          <p><strong>Areas for Improvement:</strong> {review.areasForImprovement}</p>
          <p><strong>Suggestions:</strong> {review.suggestions}</p>
          <p><strong>Additional Comments:</strong> {review.additionalComments}</p>
          <p className="mt-2 text-sm">
            <strong>Status:</strong> {review.status}
          </p>
          {review.status !== 'read' && (
            <button
              onClick={() => markAsRead(review._id)}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mark as Read
            </button>
          )}
        </div>
      ))}
      {visibleCount < reviews.length && (
        <button
          onClick={handleSeeMore}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 block mx-auto"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default ManagementReviews;
