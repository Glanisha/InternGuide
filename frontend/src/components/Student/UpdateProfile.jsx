import { useState, useEffect } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    skills: [],
    interests: [],
    cgpa: "",
    resume: "",
    achievements: [],
    phoneNumber: "",
    linkedinProfile: "",
    portfolioWebsite: "",
    certifications: [],
    availability: "",
    preferredRoles: [],
    locationPreference: "",
    references: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/student/me", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/student/update", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block">Skills (comma-separated):</label>
          <input type="text" name="skills" value={formData.skills.join(", ")} onChange={(e) => handleArrayChange(e, "skills")} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Interests (comma-separated):</label>
          <input type="text" name="interests" value={formData.interests.join(", ")} onChange={(e) => handleArrayChange(e, "interests")} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">CGPA:</label>
          <input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full p-2 border rounded" step="0.1" min="0" max="10" />
        </div>

        <div>
          <label className="block">Resume (URL):</label>
          <input type="url" name="resume" value={formData.resume} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Achievements (comma-separated):</label>
          <input type="text" name="achievements" value={formData.achievements.join(", ")} onChange={(e) => handleArrayChange(e, "achievements")} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">LinkedIn Profile:</label>
          <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Portfolio Website:</label>
          <input type="url" name="portfolioWebsite" value={formData.portfolioWebsite} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Certifications (comma-separated):</label>
          <input type="text" name="certifications" value={formData.certifications.join(", ")} onChange={(e) => handleArrayChange(e, "certifications")} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Availability:</label>
          <select name="availability" value={formData.availability} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block">Preferred Roles (comma-separated):</label>
          <input type="text" name="preferredRoles" value={formData.preferredRoles.join(", ")} onChange={(e) => handleArrayChange(e, "preferredRoles")} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">Location Preference:</label>
          <input type="text" name="locationPreference" value={formData.locationPreference} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block">References (comma-separated):</label>
          <input type="text" name="references" value={formData.references.join(", ")} onChange={(e) => handleArrayChange(e, "references")} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
