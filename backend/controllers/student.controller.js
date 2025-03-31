import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const applyForInternship = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    student.appliedInternships.push({ internship: req.params.id });
    await student.save();
    res.status(200).json({ message: "Application submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const trackApplication = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "appliedInternships.internship"
    );
    res.status(200).json(student.appliedInternships);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMentor = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate("assignedMentor");
    res.status(200).json(student.assignedMentor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const trackProgress = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate("progress.internship");
    res.status(200).json(student.progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate("feedback.mentor");
    res.status(200).json(student.feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const generateReport = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    res.status(200).json({
      name: student.name,
      email: student.email,
      department: student.department,
      internships: student.appliedInternships.length,
      progress: student.progress,
      feedback: student.feedback,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
      // console.log("Decoded JWT user:", req.user);
      const userId = req.user?.id; 
      console.log("Searching for Student with userId:", userId);

      if (!userId) {
          return res.status(400).json({ message: "User ID missing in request" });
      }
      const student = await Student.findOne({ userId });

      if (!student) {
          console.log("❌ No student found with this userId");
          return res.status(404).json({ message: "Student profile not found" });
      }
      Object.assign(student, req.body);
      await student.save();
      console.log("✅ Student profile updated successfully");
      res.status(200).json({ message: "Profile updated", student });
  } catch (error) {
      console.error("❌ Error updating student profile:", error);
      res.status(500).json({ message: "Server error", error });
  }
};

export const findBestInternship = async (req, res) => {
  try {
    console.log("User from request:", req.user); 

    const studentId = req.user?.id;
    if (!studentId) return res.status(400).json({ error: "User ID missing in request" });

    const student = await Student.findOne({ userId: studentId });
    console.log("Student found:", student); 

    if (!student) return res.status(404).json({ error: "Student not found" });

    const bestInternships = await Internship.find({
      status: "Open",
      $or: [
        { skillsRequired: { $in: student.skills } }, 
        { role: { $regex: new RegExp(student.preferredRoles.join("|"), "i") } }, 
        { location: student.locationPreference || { $exists: true } }, 
        { mode: { $in: [student.availability, "Remote"] } }, 
      ],
    })
      .sort({ applicationDeadline: 1 }) 
      .limit(10);

    return res.status(200).json(bestInternships);
  } catch (error) {
    console.error("Error finding best internship:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
