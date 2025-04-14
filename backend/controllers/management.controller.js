import Internship from "../models/internship.model.js";
import Student from '../models/student.model.js';
import Application from '../models/application.model.js';

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
