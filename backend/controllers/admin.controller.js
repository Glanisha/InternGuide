import axios from "axios";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import mongoose from 'mongoose';
import Request from "../models/request.model.js";
import Internship from "../models/internship.model.js";
import Application from "../models/application.model.js";
import Viewer from "../models/viewer.model.js";
import ViewerMentor from "../models/viewerMentor.model.js";
import User from '../models/user.model.js';



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

// Fetch all pending requests, optionally filter by requestType
export const getPendingRequests = async (req, res) => {
  const { requestType } = req.query; // Accept filter as query param

  try {
    // If a specific requestType is provided, filter by that type
    const filter = { status: "pending" };
    if (requestType) {
      filter.requestType = requestType; // Will filter by the requestType if provided
    }

    const requests = await Request.find(filter).populate("viewerId");
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
    // Find the request and populate viewer
    const request = await Request.findById(requestId).populate('viewerId');

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Mark request as approved
    request.status = "approved";
    await request.save();

    // Handle internship request
    if (request.requestType === "internship") {
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
        status: "Open",
      });

      const savedInternship = await newInternship.save();

      return res.json({
        message: "Internship request approved and internship created",
        internship: savedInternship,
      });
    }

    // Handle become-mentor request
    else if (request.requestType === "become-mentor") {
      const viewer = request.viewerId;

      if (!viewer) {
        return res.status(404).json({ error: "Viewer not found" });
      }

      // Find associated user
      const user = await User.findById(viewer._id);
      if (!user) {
        return res.status(404).json({ error: "Associated user not found" });
      }

      // Extract name/email/interests
      const name = request.mentorDetails?.name || viewer.name;
      const email = request.mentorDetails?.email || viewer.email;

      let interests = request.mentorDetails?.interests?.length
        ? request.mentorDetails.interests
        : viewer.interests || [];

      const viewerMentor = new ViewerMentor({
        userId: user._id,
        viewerId: viewer._id,
        name,
        email,
        interests,
      });

      const savedMentor = await viewerMentor.save();

      return res.json({
        message: "Mentor request approved. Viewer is now a mentor.",
        mentor: savedMentor,
      });
    }

    // Handle message request
    else if (request.requestType === "message") {
      return res.json({
        message: "Message request approved successfully.",
      });
    }

    // Unknown request type
    else {
      return res.status(400).json({ error: "Unknown request type" });
    }
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
      pendingApplications,
      allInternships,
      allApplications,
      allStudents,
      allCompanies
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Viewer.countDocuments(),
      Internship.countDocuments({ status: "Open" }),
      Internship.countDocuments({
        status: "Closed",
        applicationDeadline: { $gte: new Date() }
      }),
      Application.countDocuments({ status: "Pending" }),
      Internship.find(),
      Application.find().populate('student'),
      Student.find(),
      Internship.distinct('company')
    ]);

    // Calculate student participation rate
    const studentsWithInternships = allStudents.filter(s => s.appliedInternships.length > 0).length;
    const participationRate = totalStudents > 0 
      ? (studentsWithInternships / totalStudents * 100).toFixed(2) 
      : 0;

    // Industry collaboration statistics
    const uniqueCompanies = [...new Set(allInternships.map(i => i.company))];
    const companyCount = uniqueCompanies.length;
    const topCompanies = allInternships.reduce((acc, internship) => {
      const existing = acc.find(c => c.name === internship.company);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: internship.company, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 10); // Changed to top 10 companies

    // SDG Analytics
    const sdgDistribution = allInternships.reduce((acc, internship) => {
      if (internship.sdgGoals && internship.sdgGoals.length > 0) {
        internship.sdgGoals.forEach(sdg => {
          const existing = acc.find(s => s.sdg === sdg);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ sdg, count: 1 });
          }
        });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    // Student SDG participation
    const studentSdgParticipation = allStudents.reduce((acc, student) => {
      student.appliedInternships.forEach(app => {
        const internship = allInternships.find(i => i._id.equals(app.internship));
        if (internship && internship.sdgGoals) {
          internship.sdgGoals.forEach(sdg => {
            const existing = acc.find(s => s.sdg === sdg);
            if (existing) {
              existing.students++;
            } else {
              acc.push({ sdg, students: 1 });
            }
          });
        }
      });
      return acc;
    }, []).sort((a, b) => b.students - a.students);

    // Internship Placement Analytics
    const placementRate = allApplications.length > 0
      ? (allApplications.filter(a => a.status === 'Accepted').length / allApplications.length * 100).toFixed(2)
      : 0;

    // Industry distribution of internships
    const industryDistribution = allInternships.reduce((acc, internship) => {
      const industry = internship.department || 'Other';
      const existing = acc.find(i => i.industry === industry);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ industry, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    // Student skills analysis
    const popularSkills = allStudents.reduce((acc, student) => {
      if (student.skills && student.skills.length > 0) {
        student.skills.forEach(skill => {
          const existing = acc.find(s => s.skill === skill);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ skill, count: 1 });
          }
        });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 10);

    // Student preferred roles
    const preferredRoles = allStudents.reduce((acc, student) => {
      if (student.preferredRoles && student.preferredRoles.length > 0) {
        student.preferredRoles.forEach(role => {
          const existing = acc.find(r => r.role === role);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ role, count: 1 });
          }
        });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count).slice(0, 5);

    // Work mode preferred by companies
    const companyWorkModePreference = allInternships.reduce((acc, internship) => {
      const existing = acc.find(m => m.mode === internship.mode);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ mode: internship.mode, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    // Work mode preferred by students (assuming students have preferredMode field)
    const studentWorkModePreference = allStudents.reduce((acc, student) => {
      if (student.preferredMode) {
        const existing = acc.find(m => m.mode === student.preferredMode);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ mode: student.preferredMode, count: 1 });
        }
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      stats: {
        // Existing stats
        totalStudents,
        totalMentors,
        totalViewers,
        activeInternships,
        ongoingInternships,
        pendingApplications,
        
        // New stats
        totalInternships: allInternships.length,
        participationRate: `${participationRate}%`,
        industryCollaboration: {
          totalCompanies: companyCount,
          allCompanies: uniqueCompanies, // Added list of all companies
          topCompanies // Now shows top 10 companies
        },
        sdgAnalytics: {
          sdgDistribution,
          studentSdgParticipation
        },
        placementAnalytics: {
          placementRate: `${placementRate}%`,
          totalApplications: allApplications.length,
          acceptedApplications: allApplications.filter(a => a.status === 'Accepted').length,
          industryDistribution,
          popularSkills,
          preferredRoles
        },
        modeDistribution: {
          remote: allInternships.filter(i => i.mode === 'Remote').length,
          hybrid: allInternships.filter(i => i.mode === 'Hybrid').length,
          onsite: allInternships.filter(i => i.mode === 'Onsite').length,
          companyPreferences: companyWorkModePreference, // Added company work mode preferences
          studentPreferences: studentWorkModePreference // Added student work mode preferences
        },
        departmentStats: {
          departments: allInternships.reduce((acc, internship) => {
            const dept = internship.department || 'Other';
            const existing = acc.find(d => d.department === dept);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ department: dept, count: 1 });
            }
            return acc;
          }, []).sort((a, b) => b.count - a.count)
        }
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