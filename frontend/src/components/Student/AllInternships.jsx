import React, { useEffect, useState } from "react";
import axios from "axios";

const AllInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/internships");
        setInternships(response.data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">Available Internships</h1>
      {loading ? (
        <p className="text-center">Loading internships...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <div key={internship._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{internship.title}</h2>
              <p className="text-gray-600">Company: {internship.company}</p>
              <p className="text-gray-700">{internship.description}</p>
              <p className="text-sm text-gray-500 mt-2">Department: {internship.department}</p>
              <p className="text-sm text-gray-500">Mode: {internship.mode}</p>
              <p className="text-sm text-gray-500">Duration: {internship.internshipDuration}</p>
              <p className="text-sm text-gray-500">
                Application Deadline: {new Date(internship.applicationDeadline).toDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllInternships;
