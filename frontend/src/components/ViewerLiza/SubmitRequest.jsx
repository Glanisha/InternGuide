import React, { useState } from 'react';
import axios from 'axios';

const SubmitRequest = () => {
  const [requestType, setRequestType] = useState('message');
  const [message, setMessage] = useState('');
  const [mentorDetails, setMentorDetails] = useState({
    name: '',
    email: '',
    interests: ['']
  });
  const [internshipDetails, setInternshipDetails] = useState({
    title: '',
    company: '',
    description: '',
    role: '',
    requirements: [''],
    department: '',
    sdgGoals: [''],
    programOutcomes: [''],
    educationalObjectives: [''],
    location: '',
    mode: 'Remote',
    applicationDeadline: '',
    internshipDuration: '',
    stipend: '',
  });

  const handleInternshipChange = (e) => {
    const { name, value } = e.target;
    setInternshipDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleMentorChange = (e) => {
    const { name, value } = e.target;
    setMentorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayFieldChange = (e, field, index, stateObj, setStateObj) => {
    const updated = [...stateObj[field]];
    updated[index] = e.target.value;
    setStateObj({ ...stateObj, [field]: updated });
  };

  const addArrayField = (field, stateObj, setStateObj) => {
    setStateObj({ ...stateObj, [field]: [...stateObj[field], ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    // Include requestType in the body
    const body = { 
      requestType, 
      message 
    };
    
    if (requestType === 'internship') {
      body.internshipDetails = internshipDetails;
    } else if (requestType === 'become-mentor') {
      // Include mentor details directly in the request body
      body.mentorDetails = mentorDetails;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/viewers/request',
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert('Submission failed.');
    }
  };

  // Form validation
  const validateForm = () => {
    if (requestType === 'internship') {
      // Validate required internship fields
      return internshipDetails.title && 
             internshipDetails.company && 
             internshipDetails.description && 
             internshipDetails.role;
    } else if (requestType === 'become-mentor') {
      // Validate mentor fields
      return mentorDetails.name && 
             mentorDetails.email && 
             mentorDetails.interests.length > 0 && 
             mentorDetails.interests[0].trim() !== '';
    }
    // For message request, only message is required
    return message.trim() !== '';
  };

  return (
    <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Submit a Request</h2>

      {/* Request Type Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Request Type:</label>
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-white"
        >
          <option value="message">Message Request</option>
          <option value="internship">Internship Request</option>
          <option value="become-mentor">Become a Mentor</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mentor Form */}
        {requestType === 'become-mentor' && (
          <>
            <h3 className="text-xl font-semibold mb-2">Mentor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Full Name:</label>
                <input 
                  name="name" 
                  value={mentorDetails.name}
                  placeholder="Enter your full name" 
                  onChange={handleMentorChange} 
                  className="input"
                  required 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Email:</label>
                <input 
                  name="email" 
                  type="email"
                  value={mentorDetails.email}
                  placeholder="Enter your email" 
                  onChange={handleMentorChange} 
                  className="input"
                  required 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Interests:</label>
                {mentorDetails.interests.map((interest, idx) => (
                  <input
                    key={idx}
                    value={interest}
                    placeholder={`Interest ${idx + 1}`}
                    onChange={(e) => handleArrayFieldChange(e, 'interests', idx, mentorDetails, setMentorDetails)}
                    className="input mb-2"
                    required={idx === 0}
                  />
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayField('interests', mentorDetails, setMentorDetails)} 
                  className="text-blue-400 text-sm"
                >
                  + Add Interest
                </button>
              </div>
            </div>
          </>
        )}

        {/* Internship Form */}
        {requestType === 'internship' && (
          <>
            <h3 className="text-xl font-semibold mb-2">Internship Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="title" 
                value={internshipDetails.title}
                placeholder="Title" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="company" 
                value={internshipDetails.company}
                placeholder="Company" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="role" 
                value={internshipDetails.role}
                placeholder="Role" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="department" 
                value={internshipDetails.department}
                placeholder="Department" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="location" 
                value={internshipDetails.location}
                placeholder="Location" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                type="date" 
                name="applicationDeadline" 
                value={internshipDetails.applicationDeadline}
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="internshipDuration" 
                value={internshipDetails.internshipDuration}
                placeholder="Duration" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <input 
                name="stipend" 
                value={internshipDetails.stipend}
                placeholder="Stipend" 
                onChange={handleInternshipChange} 
                className="input" 
                required 
              />
              <select 
                name="mode" 
                value={internshipDetails.mode} 
                onChange={handleInternshipChange} 
                className="input"
                required
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
              <textarea 
                name="description" 
                value={internshipDetails.description}
                placeholder="Description" 
                onChange={handleInternshipChange} 
                className="input md:col-span-2"
                required 
              />
            </div>

            {/* Array Fields */}
            {['requirements', 'sdgGoals', 'programOutcomes', 'educationalObjectives'].map((field) => (
              <div key={field}>
                <label className="block font-medium mt-4 mb-1 capitalize">{field}:</label>
                {internshipDetails[field].map((val, idx) => (
                  <input
                    key={idx}
                    value={val}
                    placeholder={`${field} ${idx + 1}`}
                    onChange={(e) => handleArrayFieldChange(e, field, idx, internshipDetails, setInternshipDetails)}
                    className="input mb-2"
                    required={idx === 0}
                  />
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayField(field, internshipDetails, setInternshipDetails)} 
                  className="text-blue-400 text-sm"
                >
                  + Add {field}
                </button>
              </div>
            ))}
          </>
        )}

        {/* Message Field */}
        <div>
          <label className="block font-medium mb-2">
            {requestType === 'become-mentor' ? 'Additional Message (optional):' : 'Message:'}
          </label>
          <textarea
            required={requestType !== 'become-mentor'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="input w-full h-24"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-md font-semibold text-white"
          disabled={!validateForm()}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

// Make sure to add this styling to your CSS
const inputClass = "bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-white";

export default SubmitRequest;