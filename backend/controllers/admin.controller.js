import axios from "axios";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import mongoose from 'mongoose';

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
        await Student.findByIdAndUpdate(studentId, { assignedMentor: facultyId });
      }
      
      res.json({ message: "Mentors assignments confirmed and saved" });
  } catch (error) {
      console.error("Error confirming mentors:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};