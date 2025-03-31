import axios from "axios";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import mongoose from 'mongoose';


export const assignMentors = async (req, res) => {
    try {
        const students = await Student.find({}, "_id skills interests");
        const faculty = await Faculty.find({}, "_id areasOfExpertise researchInterests");
    
        if (students.length === 0 || faculty.length === 0) {
          return res.status(400).json({ error: "No students or faculty found" });
        }
    
        // Send data to Python API
        const response = await axios.post("http://127.0.0.1:5000/assign-mentors", {
          students,
          faculty,
        });
    
        const mentorAssignments = response.data;
    
        // Update students with assigned mentors
        for (const [studentId, facultyId] of Object.entries(mentorAssignments)) {
          await Student.findByIdAndUpdate(studentId, { assignedMentor: facultyId });
        }
    
        res.json({ message: "Mentors assigned successfully", assignments: mentorAssignments });
    
      } catch (error) {
        console.error("Error assigning mentors:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};
