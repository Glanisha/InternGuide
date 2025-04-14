import Internship from "../models/internship.model.js";
import Student from '../models/student.model.js';
import Application from '../models/application.model.js';
import Request from '../models/request.model.js';

export const getInternshipAnalytics = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('applicants')
      .populate('applications');

    const departmentWise = {};
    const studentWise = {};

    internships.forEach(internship => {
      // Count department-wise internships
      const dept = internship.department || 'Unknown';
      departmentWise[dept] = (departmentWise[dept] || 0) + 1;

      // Count each applicant (student) application
      internship.applicants?.forEach(student => {
        const studentName = student.name || 'Unnamed Student';
        studentWise[studentName] = (studentWise[studentName] || 0) + 1;
      });
    });

    res.status(200).json({
      departmentWise,
      studentWise,
      totalInternships: internships.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all viewer requests
export const getViewerRequests = async (req, res) => {
  try {
    // Find all requests
    const requests = await Request.find().populate('viewerId').populate('internshipId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (pending -> resolved)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;  // status should be 'pending' or 'resolved'

    // Find the request and update its status
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated request
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
