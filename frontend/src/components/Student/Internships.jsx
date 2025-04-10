import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InternshipCard from './InternshipCard';
import ApplicationFormModal from './ApplicationFormModal';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [internshipsRes, recommendedRes] = await Promise.all([
          axios.get('http://localhost:8000/api/internships'),
          axios.get('http://localhost:8000/api/student/best-internship', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        setInternships(internshipsRes.data);
        setRecommendedInternships(recommendedRes.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const submitApplication = async (resumeFile) => {
    if (!selectedInternship) return;

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const token = localStorage.getItem('token');

      await axios.post(
        `http://localhost:8000/api/internships/${selectedInternship._id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Application submitted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error applying for internship:', error);
      alert('Failed to apply.');
    }
  };

  const filteredInternships = (showRecommended ? recommendedInternships : internships).filter(
    (internship) => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();

      if (filter === 'company') {
        return internship.company.toLowerCase().includes(term);
      } else if (filter === 'skills') {
        return internship.skillsRequired?.some((skill) =>
          skill.toLowerCase().includes(term)
        );
      }

      return (
        internship.company.toLowerCase().includes(term) ||
        internship.title.toLowerCase().includes(term) ||
        internship.skillsRequired?.some((skill) =>
          skill.toLowerCase().includes(term)
        )
      );
    }
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Internship Opportunities
        </h2>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowRecommended(!showRecommended)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all"
          >
            {showRecommended ? 'Show All' : 'Get Recommendations'}
          </button>
        </div>
      </div>

      {showRecommended && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 mb-6 rounded-lg bg-neutral-900/50 border border-white/10">
          <h3 className="text-lg font-medium text-white">Recommended For You</h3>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search internships..."
              className="px-4 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-4 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="company">Company</option>
              <option value="skills">Skills</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white">Loading internships...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                onApply={() => handleApplyClick(internship)}
              />
            ))
          ) : (
            <p className="text-white">No internships found.</p>
          )}
        </div>
      )}

      {/* Modal */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitApplication}
        internshipTitle={selectedInternship?.title}
      />
    </div>
  );
};

export default Internships;
