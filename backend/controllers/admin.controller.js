import axios from "axios";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import mongoose from 'mongoose';
import Request from "../models/request.model.js";
import Internship from "../models/internship.model.js";
import Application from "../models/application.model.js";
import Viewer from "../models/viewer.model.js";


export const assignMentors = async (req, res) => {
  try {
      const students = await Student.find({}, "_id name skills interests");
      const faculty = await Faculty.find({}, "_id name areasOfExpertise researchInterests");
      if (students.length === 0 || faculty.length === 0) {
        return res.status(400).json({ error: "No students or faculty found" });
      }
      const response = await axios.post("http://127.0.0.1:5000/assign-mentors", {
        students,
        faculty,
      });
      const mentorAssignments = response.data;
      
      // Instead of saving, return the assignments for review
      res.json({ 
        message: "Mentor assignments generated for review",
        assignments: mentorAssignments,
        students,
        faculty 
      });
    } catch (error) {
      console.error("Error assigning mentors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


export const confirmMentors = async (req, res) => {
  try {
    const { assignments } = req.body;

    for (const [studentId, facultyId] of Object.entries(assignments)) {
      // 1. Update student
      await Student.findByIdAndUpdate(studentId, { assignedMentor: facultyId });

      // 2. Update faculty's assignedStudents
      await Faculty.findByIdAndUpdate(
        facultyId,
        { $addToSet: { assignedStudents: studentId } } // use $addToSet to avoid duplicates
      );
    }

    res.json({ message: "Mentor assignments confirmed and saved" });
  } catch (error) {
    console.error("Error confirming mentors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" }).populate("viewerId");
    res.json({ requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve a request
export const approveRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Create the internship from the request details
    const newInternship = new Internship({
      title: request.internshipDetails.title,
      company: request.internshipDetails.company,
      description: request.internshipDetails.description,
      role: request.internshipDetails.role,
      requirements: request.internshipDetails.requirements,
      department: request.internshipDetails.department,
      sdgGoals: request.internshipDetails.sdgGoals,
      programOutcomes: request.internshipDetails.programOutcomes,
      educationalObjectives: request.internshipDetails.educationalObjectives,
      location: request.internshipDetails.location,
      mode: request.internshipDetails.mode,
      applicationDeadline: request.internshipDetails.applicationDeadline,
      internshipDuration: request.internshipDetails.internshipDuration,
      stipend: request.internshipDetails.stipend,
      status: "Open", // Internship status is set to "Open"
    });

    // Save the new internship
    const savedInternship = await newInternship.save();

    // Update the request status to approved
    request.status = "approved";
    await request.save();

    res.json({
      message: "Internship request approved and internship created",
      internship: savedInternship,
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reject a request
export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Update the request status to rejected
    request.status = "rejected";
    await request.save();

    res.json({ message: "Internship request rejected" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//Lizas code for admin dashboard get stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalMentors,
      totalViewers,
      activeInternships,
      ongoingInternships,
      pendingApplications
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Viewer.countDocuments(),
      Internship.countDocuments({ status: "Open" }),
      Internship.countDocuments({
        status: "Closed",
        applicationDeadline: { $gte: new Date() }
      }),
      Application.countDocuments({ status: "Pending" })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalMentors,
        totalViewers,
        activeInternships,
        ongoingInternships,
        pendingApplications
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};