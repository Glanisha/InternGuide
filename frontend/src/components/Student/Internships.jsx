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

  // Additional filter options
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sdgFilter, setSdgFilter] = useState('');
  const [programOutcomesFilter, setProgramOutcomesFilter] = useState('');
  const [educationalObjectivesFilter, setEducationalObjectivesFilter] = useState('');

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
      // Search term filtering
      const term = searchTerm.toLowerCase().trim();
      const matchesSearchTerm = (field) => {
        if (!field) return false;
        if (Array.isArray(field)) {
          return field.some(item => String(item).toLowerCase().includes(term));
        }
        return String(field).toLowerCase().includes(term);
      };

      // Filter by selected criteria
      let matchesFilter = true;
      if (term) {
        switch (filter) {
          case 'title':
            matchesFilter = matchesSearchTerm(internship.title);
            break;
          case 'company':
            matchesFilter = matchesSearchTerm(internship.company);
            break;
          case 'skillsRequired':
            matchesFilter = matchesSearchTerm(internship.skillsRequired);
            break;
          case 'location':
            matchesFilter = matchesSearchTerm(internship.location);
            break;
          case 'stipend':
            matchesFilter = matchesSearchTerm(internship.stipend);
            break;
          case 'duration':
            matchesFilter = matchesSearchTerm(internship.duration);
            break;
          case 'description':
            matchesFilter = matchesSearchTerm(internship.description);
            break;
          case 'department':
            matchesFilter = matchesSearchTerm(internship.department);
            break;
          case 'sdgGoals':
            matchesFilter = matchesSearchTerm(internship.sdgGoals);
            break;
          case 'programOutcomes':
            matchesFilter = matchesSearchTerm(internship.programOutcomes);
            break;
          case 'educationalObjectives':
            matchesFilter = matchesSearchTerm(internship.educationalObjectives);
            break;
          case 'all':
          default:
            matchesFilter = (
              matchesSearchTerm(internship.title) ||
              matchesSearchTerm(internship.company) ||
              matchesSearchTerm(internship.skillsRequired) ||
              matchesSearchTerm(internship.location) ||
              matchesSearchTerm(internship.stipend) ||
              matchesSearchTerm(internship.duration) ||
              matchesSearchTerm(internship.description) ||
              matchesSearchTerm(internship.department) ||
              matchesSearchTerm(internship.sdgGoals) ||
              matchesSearchTerm(internship.programOutcomes) ||
              matchesSearchTerm(internship.educationalObjectives)
            );
        }
      }

      // Additional filters
      const matchesDepartment = departmentFilter ? 
        String(internship.department).toLowerCase().includes(departmentFilter.toLowerCase()) : true;
      
      const matchesSdg = sdgFilter ? 
        (Array.isArray(internship.sdgGoals) ? 
          internship.sdgGoals.some(sdg => String(sdg).toLowerCase().includes(sdgFilter.toLowerCase())) :
          String(internship.sdgGoals).toLowerCase().includes(sdgFilter.toLowerCase())) : true;
      
      const matchesProgramOutcomes = programOutcomesFilter ? 
        (Array.isArray(internship.programOutcomes) ? 
          internship.programOutcomes.some(po => String(po).toLowerCase().includes(programOutcomesFilter.toLowerCase())) :
          String(internship.programOutcomes).toLowerCase().includes(programOutcomesFilter.toLowerCase())) : true;
      
      const matchesEducationalObjectives = educationalObjectivesFilter ? 
        (Array.isArray(internship.educationalObjectives) ? 
          internship.educationalObjectives.some(eo => String(eo).toLowerCase().includes(educationalObjectivesFilter.toLowerCase())) :
          String(internship.educationalObjectives).toLowerCase().includes(educationalObjectivesFilter.toLowerCase())) : true;

      return matchesFilter && matchesDepartment && matchesSdg && matchesProgramOutcomes && matchesEducationalObjectives;
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

      <div className="mb-6 p-4 rounded-lg bg-neutral-900/50 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          {showRecommended ? (
            <h3 className="text-lg font-medium text-white">Recommended For You</h3>
          ) : (
            <h3 className="text-lg font-medium text-white">All Internships</h3>
          )}

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
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="company">Company</option>
              <option value="skillsRequired">Skills</option>
              <option value="location">Location</option>
              <option value="stipend">Stipend</option>
              <option value="duration">Duration</option>
              <option value="description">Description</option>
              <option value="department">Department</option>
              <option value="sdgGoals">SDG Goals</option>
              <option value="programOutcomes">Program Outcomes</option>
              <option value="educationalObjectives">Educational Objectives</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
            <input
              type="text"
              placeholder="Filter by department"
              className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">SDG Goals</label>
            <input
              type="text"
              placeholder="Filter by SDG Goals"
              className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sdgFilter}
              onChange={(e) => setSdgFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Program Outcomes</label>
            <input
              type="text"
              placeholder="Filter by Program Outcomes"
              className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={programOutcomesFilter}
              onChange={(e) => setProgramOutcomesFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Educational Objectives</label>
            <input
              type="text"
              placeholder="Filter by Educational Objectives"
              className="w-full px-3 py-2 rounded text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={educationalObjectivesFilter}
              onChange={(e) => setEducationalObjectivesFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

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
            <p className="text-white">No internships found matching your criteria.</p>
          )}
        </div>
      )}

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