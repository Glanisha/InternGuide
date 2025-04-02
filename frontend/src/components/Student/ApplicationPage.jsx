import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ApplicationPage = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: "",
    answers: [],
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }
        
        const response = await axios.get(`/api/internships/${internshipId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setInternship(response.data);
      } catch (error) {
        console.error("Error fetching internship:", error);
        if (error.response?.status === 401) {
          setError("Please login to view this internship");
        } else if (error.response?.status === 404) {
          setError("Internship not found");
        } else {
          setError("Failed to load internship details");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchInternship();
  }, [internshipId]);
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!resume) {
      setError("Please upload your resume");
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("resume", resume); // Make sure this matches backend
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("answers", JSON.stringify(formData.answers));
  
      // Debug: Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/student/apply/${internshipId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );
  
      alert("Application submitted successfully!");
      navigate("/student-dashboard/internships");
    } catch (err) {
      console.error("Application error:", err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Internship not found"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Internships
      </button>

      <h1 className="text-2xl font-bold mb-4 text-white">
        Apply for {internship.title} at {internship.company}
      </h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">
            Resume (PDF only, max 5MB)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            rows="8"
            placeholder="Explain why you're a good fit for this internship..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationPage;