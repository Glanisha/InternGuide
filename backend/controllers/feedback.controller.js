import Feedback from "../models/feedback.model.js";
import Faculty from "../models/faculty.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";


// Faculty gives feedback to student
export const giveFeedback = async (req, res) => {
  try {
    const facultyId = req.user?.id;
    const { studentId, message, rating, isPrivate } = req.body;

    // Validate input
    if (!facultyId || !studentId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get faculty and student
    const faculty = await Faculty.findOne({ userId: facultyId });
    const student = await Student.findById(studentId);

    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Verify faculty is the student's mentor
    if (student.assignedMentor?.toString() !== faculty._id.toString()) {
      return res.status(403).json({ error: "Not authorized to give feedback" });
    }

    // Create feedback
    const feedback = await Feedback.create({
      faculty: faculty._id,
      student: studentId,
      message,
      rating,
      isPrivate
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error giving feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Student replies to feedback
export const addReply = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { feedbackId, message } = req.body;

    if (!feedbackId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get feedback
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Verify user is either the faculty or student in this feedback
    const student = await Student.findOne({ userId });
    const faculty = await Faculty.findOne({ userId });

    const isStudent = student && student._id.equals(feedback.student);
    const isFaculty = faculty && faculty._id.equals(feedback.faculty);

    if (!isStudent && !isFaculty) {
      return res.status(403).json({ error: "Not authorized to reply" });
    }

    // Add reply
    feedback.replies.push({
      sender: isFaculty ? "faculty" : "student",
      message
    });

    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get feedback for student
export const getStudentFeedback = async (req, res) => {
  try {
    const userId = req.user?.id;
    const student = await Student.findOne({ userId });

    if (!student) return res.status(404).json({ error: "Student not found" });

    const feedback = await Feedback.find({ student: student._id })
      .populate("faculty", "name email department designation")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error getting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get feedback given by faculty
export const getFacultyFeedback = async (req, res) => {
  try {
    const userId = req.user?.id;
    const faculty = await Faculty.findOne({ userId });

    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    const feedback = await Feedback.find({ faculty: faculty._id })
      .populate("student", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error getting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};