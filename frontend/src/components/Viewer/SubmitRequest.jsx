import React, { useState } from 'react';
import axios from 'axios';

const SubmitRequest = () => {
  const [requestType, setRequestType] = useState('normal');
  const [message, setMessage] = useState('');
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

  const handleArrayFieldChange = (e, field, index) => {
    const updated = [...internshipDetails[field]];
    updated[index] = e.target.value;
    setInternshipDetails({ ...internshipDetails, [field]: updated });
  };

  const addArrayField = (field) => {
    setInternshipDetails({ ...internshipDetails, [field]: [...internshipDetails[field], ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const body = { message };
    if (requestType === 'internship') {
      body.internshipDetails = internshipDetails;
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
          <option value="normal">Normal Request</option>
          <option value="internship">Internship Request</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Internship Form */}
        {requestType === 'internship' && (
          <>
            <h3 className="text-xl font-semibold mb-2">Internship Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" placeholder="Title" onChange={handleInternshipChange} className="input" />
              <input name="company" placeholder="Company" onChange={handleInternshipChange} className="input" />
              <input name="role" placeholder="Role" onChange={handleInternshipChange} className="input" />
              <input name="department" placeholder="Department" onChange={handleInternshipChange} className="input" />
              <input name="location" placeholder="Location" onChange={handleInternshipChange} className="input" />
              <input type="date" name="applicationDeadline" onChange={handleInternshipChange} className="input" />
              <input name="internshipDuration" placeholder="Duration" onChange={handleInternshipChange} className="input" />
              <input name="stipend" placeholder="Stipend" onChange={handleInternshipChange} className="input" />
              <select name="mode" value={internshipDetails.mode} onChange={handleInternshipChange} className="input">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
              <textarea name="description" placeholder="Description" onChange={handleInternshipChange} className="input md:col-span-2" />
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
                    onChange={(e) => handleArrayFieldChange(e, field, idx)}
                    className="input mb-2"
                  />
                ))}
                <button type="button" onClick={() => addArrayField(field)} className="text-blue-400 text-sm">
                  + Add {field}
                </button>
              </div>
            ))}
          </>
        )}

        {/* Message Field */}
        <div>
          <label className="block font-medium mb-2">Message:</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="input w-full h-24"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-md font-semibold text-white"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

// Tailwind input class shortcut
const inputClass = "bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-white";

export default SubmitRequest;
