import React, { useEffect, useState } from 'react';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const [internshipRes, savedRes] = await Promise.all([
          fetch('http://localhost:8000/api/internships'),
          fetch('http://localhost:8000/api/viewers/internships/saved', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const internshipData = await internshipRes.json();
        const savedData = await savedRes.json();

        setInternships(internshipData);

        // Safe check to ensure savedData is an array
        const savedIdSet = new Set(
          Array.isArray(savedData) ? savedData.map((item) => item._id) : []
        );
        setSavedIds(savedIdSet);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch internships or saved internships", error);
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const handleSave = async (internshipId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8000/api/viewers/internships/save/${internshipId}`, {
        method: savedIds.has(internshipId) ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to save/unsave internship");

      setSavedIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(internshipId)) {
          updated.delete(internshipId);
        } else {
          updated.add(internshipId);
        }
        return updated;
      });
    } catch (error) {
      console.error("Error saving internship:", error.message);
    }
  };

  if (loading) return <div style={styles.loading}>Loading internships...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Internships</h2>
      {internships.length === 0 ? (
        <p style={styles.noInternships}>No internships available at the moment.</p>
      ) : (
        <div style={styles.grid}>
          {internships.map((internship) => (
            <div key={internship._id} style={styles.card}>
              <h3 style={styles.title}>{internship.title}</h3>
              <p style={styles.detail}><strong>Company:</strong> {internship.company}</p>
              <p style={styles.detail}><strong>Location:</strong> {internship.location}</p>
              <p style={styles.detail}><strong>Deadline:</strong> {new Date(internship.deadline).toDateString()}</p>
              <p style={styles.description}><strong>Description:</strong> {internship.description}</p>
              <button
                onClick={() => handleSave(internship._id)}
                style={savedIds.has(internship._id) ? styles.savedButton : styles.saveButton}
              >
                {savedIds.has(internship._id) ? "Saved" : "Save Internship"}
                {savedIds.has(internship._id) && <span style={styles.checkmark}> ✓</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#e0e0e0',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#4a90e2',
    fontSize: '1.5rem',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#4a90e2',
    fontSize: '2.2rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(74, 144, 226, 0.3)',
  },
  noInternships: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '1.2rem',
    marginTop: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.8rem',
    padding: '0 1rem',
  },
  card: {
    padding: '1.8rem',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 16px rgba(74, 144, 226, 0.2)',
      borderColor: '#4a90e2',
    },
  },
  title: {
    marginBottom: '1rem',
    color: '#4a90e2',
    fontSize: '1.4rem',
    fontWeight: '500',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '0.8rem',
  },
  detail: {
    margin: '0.6rem 0',
    lineHeight: '1.5',
    color: '#d0d0d0',
  },
  description: {
    margin: '1rem 0',
    lineHeight: '1.6',
    color: '#b0b0b0',
  },
  saveButton: {
    marginTop: '1.2rem',
    padding: '0.7rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#4a90e2',
    border: '2px solid #4a90e2',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    width: '100%',
    ':hover': {
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      transform: 'translateY(-2px)',
    },
  },
  savedButton: {
    marginTop: '1.2rem',
    padding: '0.7rem 1.5rem',
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    color: '#4a90e2',
    border: '2px solid #4a90e2',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  checkmark: {
    color: '#4a90e2',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
};

export default InternshipsPage;