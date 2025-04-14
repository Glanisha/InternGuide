// controllers/application.controller.js
import Application from "../models/application.model.js";
import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";

export const submitApplication = async (req, res) => {
    try {
      const { internshipId } = req.params;
      const studentId = req.user?.id;
      const { coverLetter } = req.body;
      
      // Get uploaded file info
      const resumeFile = req.file;
  
      if (!resumeFile) {
        return res.status(400).json({ message: "Resume is required" });
      }
  
      const internship = await Internship.findById(internshipId);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
  
      const student = await Student.findOne({ userId: studentId });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Create new application
      const application = new Application({
        student: student._id,
        internship: internshipId,
        resume: resumeFile.path,
        coverLetter: coverLetter || '',
        status: "Pending"
      });
  
      await application.save();
  
      // Update student's appliedInternships array
      student.appliedInternships.push({
        internship: internship._id,
        status: "Pending",
        application: application._id
      });
      await student.save();
  
      // Update internship's applications array
      internship.applications.push(application._id);
      await internship.save();
  
      res.status(201).json({
        message: "Application submitted successfully",
        application
      });
    } catch (err) {
      console.error("Application error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;

    if (!["Accepted", "Rejected", "Under Review"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update application
    application.status = status;
    application.decisionDate = new Date();
    if (feedback) application.feedback.fromAdmin = feedback;
    await application.save();

    // Update student's appliedInternships status
    const student = await Student.findOne({ _id: application.student });
    if (student) {
      const internshipApplication = student.appliedInternships.find(app => 
        app.internship.toString() === application.internship.toString()
      );
      if (internshipApplication) {
        internshipApplication.status = status;
        await student.save();
      }
    }

    res.status(200).json({
      message: `Application ${status.toLowerCase()}`,
      application
    });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("student", "name email department")
      .populate("internship", "title company description");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error("Get application error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplicationsForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const applications = await Application.find({ internship: internshipId })
      .populate("student", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user?.id;

    const student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const applications = await Application.find({ student: student._id })
      .populate("internship", "title company description status")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Get student applications error:", err);
    res.status(500).json({ error: "Server error" });
  }
};