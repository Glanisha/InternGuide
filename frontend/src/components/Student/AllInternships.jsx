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
          style={{ backgroundColor: '#292E33' }}
        >
          <div className="flex items-start mb-3">
            {/* Placeholder logo */}
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

export default AllInternships;