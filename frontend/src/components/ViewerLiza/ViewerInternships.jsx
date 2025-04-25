import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewerInternshipCard from './ViewerInternshipCard';

const ViewerInternships = () => {
  const [internships, setInternships] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showSaved, setShowSaved] = useState(false);

  // Load saved internships from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedInternships')) || [];
    setSavedInternships(saved);
  }, []);

  // Fetch all internships
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/internships');
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update saved internships list
  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedInternships')) || [];
    setSavedInternships(saved);
  };

  // Filter logic
  const filteredInternships = (showSaved ? savedInternships : internships).filter(
    (internship) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;

      const matchesSearchTerm = (field) => {
        if (!field) return false;
        if (Array.isArray(field)) {
          return field.some(item => String(item).toLowerCase().includes(term));
        }
        return String(field).toLowerCase().includes(term);
      };

      switch (filter) {
        case 'title': return matchesSearchTerm(internship.title);
        case 'company': return matchesSearchTerm(internship.company);
        case 'skills': return matchesSearchTerm(internship.skillsRequired);
        case 'location': return matchesSearchTerm(internship.location);
        default: return (
          matchesSearchTerm(internship.title) ||
          matchesSearchTerm(internship.company) ||
          matchesSearchTerm(internship.skillsRequired) ||
          matchesSearchTerm(internship.location)
        );
      }
    }
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Internship Opportunities
        </h2>
        <button
          onClick={() => setShowSaved(!showSaved)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all mt-4 md:mt-0 ${
            showSaved 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-neutral-800 hover:bg-neutral-700'
          }`}
        >
          {showSaved ? 'Show All Internships' : 'View Saved Internships'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 p-4 rounded-lg bg-neutral-900/50 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
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
            <option value="all">All Fields</option>
            <option value="title">Title</option>
            <option value="company">Company</option>
            <option value="skills">Skills</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Internship List */}
      {loading ? (
        <p className="text-white">Loading internships...</p>
      ) : (
        <>
          <h3 className="text-lg font-medium text-white mb-4">
            {showSaved ? 'Your Saved Internships' : 'All Internships'}
          </h3>
          
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <ViewerInternshipCard
                  key={internship._id}
                  internship={internship}
                  onSave={handleSave}
                />
              ))}
            </div>
          ) : (
            <p className="text-white">
              {showSaved 
                ? 'You haven\'t saved any internships yet.' 
                : 'No internships found matching your criteria.'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ViewerInternships;