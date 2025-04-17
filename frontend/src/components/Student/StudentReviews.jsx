import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    mentorshipRating: 0,
    internshipRating: 0,
    sdgAlignmentRating: 0,
    industryRelevanceRating: 0,
    overallExperience: 0,
    strengths: '',
    areasForImprovement: '',
    suggestions: '',
    additionalComments: '',
    isAnonymous: false
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/student/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setReviews(response.data.reviews);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/student/reviews',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setReviews([response.data.review, ...reviews]);
      setFormData({
        mentorshipRating: 0,
        internshipRating: 0,
        sdgAlignmentRating: 0,
        industryRelevanceRating: 0,
        overallExperience: 0,
        strengths: '',
        areasForImprovement: '',
        suggestions: '',
        additionalComments: '',
        isAnonymous: false
      });
      setShowForm(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-neutral-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Student Reviews</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="bg-neutral-800/50 border border-white/5 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Submit Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating Fields */}
                {[
                  { field: 'mentorshipRating', label: 'Mentorship Quality' },
                  { field: 'internshipRating', label: 'Internship Experience' },
                  { field: 'sdgAlignmentRating', label: 'SDG Alignment' },
                  { field: 'industryRelevanceRating', label: 'Industry Relevance' },
                  { field: 'overallExperience', label: 'Overall Experience' }
                ].map(({ field, label }) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-neutral-300 text-sm font-medium">
                      {label}
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => handleRatingChange(field, star)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            formData[field] >= star 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                {[
                  { id: 'strengths', label: 'Strengths', required: true },
                  { id: 'areasForImprovement', label: 'Areas for Improvement', required: true },
                  { id: 'suggestions', label: 'Suggestions', required: true },
                  { id: 'additionalComments', label: 'Additional Comments', required: false }
                ].map(({ id, label, required }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-neutral-300 text-sm font-medium mb-1">
                      {label} {required && <span className="text-red-400">*</span>}
                    </label>
                    <textarea
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-neutral-700/50 border border-white/10 rounded-md text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required={required}
                    />
                  </div>
                ))}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="h-4 w-4 bg-neutral-700/50 border-white/10 rounded focus:ring-blue-500 text-blue-600"
                  />
                  <label htmlFor="isAnonymous" className="ml-2 text-neutral-300 text-sm">
                    Submit anonymously
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-neutral-300 hover:bg-neutral-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">Recent Reviews</h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 border border-dashed border-white/10 rounded-lg">
              No reviews yet. Be the first to submit one!
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-neutral-800/50 border border-white/5 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {review.reviewId.isAnonymous ? 'Anonymous Student' : review.reviewId.student.name}
                    </h4>
                    {!review.reviewId.isAnonymous && (
                      <p className="text-sm text-neutral-400">
                        {review.reviewId.student.department}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: 'Mentorship', value: review.reviewId.mentorshipRating },
                    { label: 'Internship', value: review.reviewId.internshipRating },
                    { label: 'SDG Alignment', value: review.reviewId.sdgAlignmentRating },
                    { label: 'Industry Relevance', value: review.reviewId.industryRelevanceRating },
                    { label: 'Overall', value: review.reviewId.overallExperience }
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs text-neutral-400">{label}</p>
                      <div className="flex items-center">
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(value / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-blue-400">{value}/5</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-blue-400 mb-1">Strengths</h5>
                    <p className="text-neutral-300">{review.reviewId.strengths}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-blue-400 mb-1">Areas for Improvement</h5>
                    <p className="text-neutral-300">{review.reviewId.areasForImprovement}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-blue-400 mb-1">Suggestions</h5>
                    <p className="text-neutral-300">{review.reviewId.suggestions}</p>
                  </div>
                  
                  {review.reviewId.additionalComments && (
                    <div>
                      <h5 className="text-sm font-medium text-blue-400 mb-1">Additional Comments</h5>
                      <p className="text-neutral-300">{review.reviewId.additionalComments}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReviews;