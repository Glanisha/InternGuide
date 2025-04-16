// src/components/Viewer/SavedInternships.jsx

import React, { useEffect, useState } from 'react';

const SavedInternships = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedInternships = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/viewers/saved-internships", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setSaved(data);
      } catch (err) {
        console.error("Error fetching saved internships", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedInternships();
  }, []);

  if (loading) return <p>Loading saved internships...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Saved Internships</h2>
      {saved.length === 0 ? (
        <p>You haven’t saved any internships yet.</p>
      ) : (
        <ul>
          {saved.map(internship => (
            <li key={internship._id} style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
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

export default SavedInternships;
