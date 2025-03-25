import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";

export const applyForInternship = async (req, res) => {
  try {
    const { studentId, internshipId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    const alreadyApplied = student.appliedInternships.some(
      (app) => app.internship.toString() === internshipId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this internship" });
    }
    student.appliedInternships.push({ internship: internshipId, status: "Pending" });
    await student.save();
    internship.applicants.push(studentId);
    await internship.save();
    return res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
