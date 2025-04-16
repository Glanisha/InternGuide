import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminRequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/pending-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.requests);
      } catch (error) {
        console.error("Error fetching requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [refresh, token]);

  const handleDecision = async (requestId, decision) => {
    const url =
      decision === "approve"
        ? `http://localhost:8000/api/admin/approve-request/${requestId}`
        : `http://localhost:8000/api/admin/reject-request/${requestId}`;

    try {
      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(`Error trying to ${decision} request`, error);
    }
  };

  if (loading) return <div style={styles.loading}>Loading requests...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Pending Viewer Requests</h2>
      {requests.length === 0 ? (
        <p style={styles.noRequests}>No pending requests.</p>
      ) : (
        <div style={styles.requestList}>
          {requests.map((req) => (
            <div key={req._id} style={styles.requestCard}>
              <div style={styles.requestHeader}>
                <h3 style={styles.requestId}>Request ID: {req._id}</h3>
                <div style={styles.statusIndicator}>PENDING</div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Viewer Information</h4>
                <p style={styles.detail}><strong>Name:</strong> {req.viewerId?.name || "N/A"}</p>
                <p style={styles.detail}><strong>Email:</strong> {req.viewerId?.email || "N/A"}</p>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Message</h4>
                <p style={styles.message}>{req.message || "No message provided"}</p>
              </div>

              {req.internshipDetails && (
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Internship Details</h4>
                  <p style={styles.detail}><strong>Title:</strong> {req.internshipDetails.title}</p>
                  <p style={styles.detail}><strong>Company:</strong> {req.internshipDetails.company}</p>
                  <p style={styles.detail}><strong>Location:</strong> {req.internshipDetails.location}</p>
                  <p style={styles.detail}><strong>Mode:</strong> {req.internshipDetails.mode}</p>
                  <p style={styles.detail}><strong>Deadline:</strong> {new Date(req.internshipDetails.applicationDeadline).toLocaleDateString()}</p>
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleDecision(req._id, "approve")}
                  style={styles.approveButton}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req._id, "reject")}
                  style={styles.rejectButton}
                >
                  Reject
                </button>
              </div>
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
  noRequests: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '1.2rem',
    marginTop: '2rem',
  },
  requestList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.8rem',
    padding: '0 1rem',
  },
  requestCard: {
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
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #2a2a2a',
  },
  requestId: {
    color: '#4a90e2',
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: 0,
  },
  statusIndicator: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    color: '#FFC107',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    color: '#4a90e2',
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.8rem',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '0.5rem',
  },
  detail: {
    margin: '0.5rem 0',
    lineHeight: '1.5',
    color: '#d0d0d0',
    fontSize: '0.95rem',
  },
  message: {
    margin: '0.5rem 0',
    lineHeight: '1.6',
    color: '#b0b0b0',
    fontStyle: 'italic',
    fontSize: '0.95rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  approveButton: {
    flex: 1,
    padding: '0.7rem',
    backgroundColor: 'transparent',
    color: '#4CAF50',
    border: '2px solid #4CAF50',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      transform: 'translateY(-2px)',
    },
  },
  rejectButton: {
    flex: 1,
    padding: '0.7rem',
    backgroundColor: 'transparent',
    color: '#F44336',
    border: '2px solid #F44336',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      transform: 'translateY(-2px)',
    },
  },
};

export default AdminRequestManager;