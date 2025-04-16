const response = await fetch('http://localhost:8000/api/internships');

import React, { useEffect, useState } from 'react';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/internships');
        const data = await response.json();
        setInternships(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch internships", error);
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  if (loading) return <p>Loading internships...</p>;

  return (
    <div>
      <h2>Available Internships</h2>
      {internships.length === 0 ? (
        <p>No internships available at the moment.</p>
      ) : (
        <ul>
          {internships.map((internship) => (
            <li key={internship._id} style={{ marginBottom: '20px' }}>
              <h3>{internship.title}</h3>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Deadline:</strong> {new Date(internship.deadline).toDateString()}</p>
              <p><strong>Description:</strong> {internship.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InternshipsPage;
