import Internship from "../models/internship.model.js";
import Student from '../models/student.model.js';
import Application from '../models/application.model.js';
import Request from '../models/request.model.js';
import PDFDocument from 'pdfkit';
import Faculty from "../models/faculty.model.js";
import Management from "../models/management.model.js";
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












// Liza's Code for this management (IDK what the previous code was doing, I didnt write it)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

// Get all faculty with their mentees
export const getAllFacultyWithMentees = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate({
        path: "assignedStudents",
        select: "name email department cgpa skills achievements"
      })
      .select("name email department assignedStudents mentoringCapacity isAvailableForMentoring")
      .lean();

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty with mentees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get detailed mentee information for a specific faculty
export const getFacultyMenteesDetails = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId)
      .populate({
        path: "assignedStudents",
        select: "name email department cgpa skills achievements appliedInternships progress feedback"
      })
      .lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty.assignedStudents);
  } catch (error) {
    console.error("Error fetching faculty mentees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate program success metrics report
export const generateProgramMetrics = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Get all students with their internships and mentors
    const students = await Student.find()
      .populate({
        path: "appliedInternships.internship",
        select: "title company description sdgGoals"
      })
      .populate("assignedMentor", "name email department")
      .lean();

    // Get all faculty with their mentoring stats
    const faculty = await Faculty.find()
      .select("name email department assignedStudents mentoringCapacity")
      .lean();

    // Calculate basic metrics
    const totalStudents = students.length;
    const totalFaculty = faculty.length;
    const internshipsCompleted = students.reduce((acc, student) => {
      const internships = student.appliedInternships || [];
      return acc + internships.filter(i => i.status === "Accepted").length;
    }, 0);
    
    // Get average mentor rating
    const ratings = students.flatMap(s => 
      s.feedback?.map(f => f.rating) || []
    );
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : 0;

      let prompt = `Generate a comprehensive program success metrics report for the internship program based on the following data:\n\n`;
    
    prompt += `Program Overview:\n`;
    prompt += `- Total Students: ${totalStudents}\n`;
    prompt += `- Total Faculty Mentors: ${totalFaculty}\n`;
    prompt += `- Internships Completed: ${internshipsCompleted}\n`;
    prompt += `- Average Mentor Rating: ${averageRating.toFixed(2)}/5\n\n`;

    prompt += `Student Performance Summary:\n`;
    students.forEach((student, index) => {
      prompt += `\nStudent ${index + 1}:\n`;
      prompt += `- Name: ${student.name}\n`;
      prompt += `- Department: ${student.department}\n`;
      prompt += `- CGPA: ${student.cgpa || "N/A"}\n`;
      prompt += `- Internships Applied: ${student.appliedInternships?.length || 0}\n`;
      prompt += `- Skills: ${student.skills?.join(", ") || "None"}\n`;
      if (student.assignedMentor) {
        prompt += `- Mentor: ${student.assignedMentor.name} (${student.assignedMentor.email})\n`;
      }
    });

    prompt += `\nFaculty Mentoring Summary:\n`;
    faculty.forEach((facultyMember, index) => {
      prompt += `\nFaculty ${index + 1}:\n`;
      prompt += `- Name: ${facultyMember.name}\n`;
      prompt += `- Department: ${facultyMember.department}\n`;
      prompt += `- Mentees Assigned: ${facultyMember.assignedStudents?.length || 0}\n`;
      prompt += `- Mentoring Capacity: ${facultyMember.mentoringCapacity}\n`;
    });

    prompt += `\nAnalysis Instructions:\n`;
    prompt += `- Provide a structured report with these sections: Program Overview, Key Performance Indicators, Student Outcomes Analysis, Mentor Effectiveness, Recommendations for Improvement\n`;
    prompt += `- Include statistical analysis where possible (percentages, averages, trends)\n`;
    prompt += `- Highlight any correlations between mentor involvement and student outcomes\n`;
    prompt += `- Suggest concrete actions to improve program effectiveness\n`;
    prompt += `- Keep the tone professional and data-driven\n`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        })
      }
    );

    const result = await geminiResponse.json();

    if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
      console.error("Gemini error or empty response:", result);
      return res.status(500).json({ message: "Failed to generate report" });
    }

    const generatedReport = result.candidates[0].content.parts[0].text;

    // Save report to management
    await Management.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          reportsGenerated: {
            report: generatedReport,
            reportType: "Program"
          } 
        },
        $set: {
          "programAnalytics.completionRate": (internshipsCompleted / totalStudents * 100).toFixed(2),
          "programAnalytics.averageRating": averageRating
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      report: generatedReport,
      metrics: {
        totalStudents,
        totalFaculty,
        internshipsCompleted,
        averageRating
      }
    });

  } catch (error) {
    console.error("Error generating program metrics:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const trackSDGContributions = async (req, res) => {
  try {
    const internships = await Internship.find().select("sdgGoals");
    
    const sdgMap = {};
    internships.forEach(internship => {
      internship.sdgGoals?.forEach(sdg => {
        if (!sdgMap[sdg]) {
          sdgMap[sdg] = { count: 0, internships: [] };
        }
        sdgMap[sdg].count++;
        sdgMap[sdg].internships.push(internship._id);
      });
    });

    // Update management SDG tracking
    await Management.findOneAndUpdate(
      { userId: req.user?.id },
      { 
        sdgTracking: Object.keys(sdgMap).map(sdg => ({
          sdg,
          contribution: sdgMap[sdg].count,
          internshipsCount: sdgMap[sdg].internships.length
        }))
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      sdgContributions: Object.keys(sdgMap).map(sdg => ({
        sdg,
        count: sdgMap[sdg].count,
        internships: sdgMap[sdg].internships.length
      }))
    });
  } catch (error) {
    console.error("Error tracking SDG contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
