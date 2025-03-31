import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllInternshipsRoute } from "../../utils";

const AllInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(getAllInternshipsRoute);
        setInternships(response.data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  if (loading) return null; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {internships.map((internship) => (
        <div 
          key={internship._id} 
          className="rounded-lg p-4 shadow-sm"
          style={{ backgroundColor: '#1F2327' }}
        >
          <div className="flex items-start mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mr-3">
              {internship.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{internship.company}</h2>
              <h3 className="text-md font-medium text-gray-300">{internship.title}</h3>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 my-3">
            <span className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
              {internship.mode}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
              {internship.department}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
              {internship.internshipDuration}
            </span>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-medium text-white">Stipend: ₹{internship.stipend || 'Not specified'}</span>
            <button
              className="px-4 py-2 text-white text-sm rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#29CB97' }}
              onClick={() => applyForInternship(internship._id)}
            >
              Apply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecommendedInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'company', 'skills'

  useEffect(() => {
    const fetchRecommendedInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/student/best-internship",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInternships(response.data);
      } catch (error) {
        console.error("Error fetching recommended internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedInternships();
  }, []);

  const filteredInternships = internships.filter((internship) => {
    if (!searchTerm) return true;
    
    if (filter === "company") {
      return internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filter === "skills") {
      return internship.skillsRequired?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return (
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.skillsRequired?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      internship.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1F2327' }}>
        <h2 className="text-xl font-semibold text-white">Recommended For You</h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search internships..."
            className="px-4 py-2 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="px-4 py-2 rounded text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="company">Company</option>
            <option value="skills">Skills</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((internship) => (
          <div 
            key={internship._id} 
            className="rounded-lg p-4 shadow-sm"
            style={{ backgroundColor: '#1F2327' }}
          >
            <div className="flex items-start mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mr-3">
                {internship.company.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{internship.company}</h2>
                <h3 className="text-md font-medium text-gray-300">{internship.title}</h3>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 my-3">
              <span className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
                {internship.mode}
              </span>
              <span className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
                {internship.department}
              </span>
              {internship.skillsRequired?.slice(0, 2).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="font-medium text-white">Stipend: ₹{internship.stipend || 'Not specified'}</span>
              <button
                className="px-4 py-2 text-white text-sm rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#29CB97' }}
                onClick={() => applyForInternship(internship._id)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Internship = () => {
  const [showRecommended, setShowRecommended] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Internship Opportunities</h1>
        <button
          onClick={() => setShowRecommended(!showRecommended)}
          className="px-6 py-2 rounded text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#29CB97' }}
        >
          {showRecommended ? "Show All Internships" : "Get My Recommendations"}
        </button>
      </div>

      {showRecommended ? <RecommendedInternships /> : <AllInternships />}
    </div>
  );
};

const applyForInternship = (internshipId) => {
  // Implement your apply functionality here
  console.log("Applying for internship:", internshipId);
};

export default Internship;