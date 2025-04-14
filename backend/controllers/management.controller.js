import Internship from "../models/internship.model.js";
import Student from '../models/student.model.js';
import Application from '../models/application.model.js';
import Request from '../models/request.model.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

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

//PDF report generation
export const downloadInternshipReportPDF = async (req, res) => {
    try {
      const internships = await Internship.find({});
  
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=internship_report.pdf');
  
      doc.pipe(res);
  
      doc.fontSize(18).text('Internship Report', { align: 'center' });
      doc.moveDown();
  
      internships.forEach((internship, i) => {
        doc
          .fontSize(12)
          .text(`${i + 1}. ${internship.title} - ${internship.company}`)
          .text(`Department: ${internship.department}`)
          .text(`Mode: ${internship.mode}, Location: ${internship.location}`)
          .text(`Deadline: ${internship.applicationDeadline?.toDateString()}`)
          .moveDown();
      });
  
      doc.end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //Excel report generation
  export const downloadInternshipReportExcel = async (req, res) => {
  try {
    const internships = await Internship.find({});

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Internships');

    sheet.columns = [
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Mode', key: 'mode', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Deadline', key: 'applicationDeadline', width: 20 },
    ];

    internships.forEach(internship => {
      sheet.addRow({
        title: internship.title,
        company: internship.company,
        department: internship.department,
        mode: internship.mode,
        location: internship.location,
        applicationDeadline: internship.applicationDeadline?.toDateString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=internship_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

