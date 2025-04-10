import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";
import Chat from "../models/chat.model.js";

import dotenv from "dotenv";
dotenv.config();

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
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "assignedMentor"
    );
    res.status(200).json(student.assignedMentor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const trackProgress = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "progress.internship"
    );
    res.status(200).json(student.progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "feedback.mentor"
    );
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
      console.log("No student found with this userId");
      return res.status(404).json({ message: "Student profile not found" });
    }
    Object.assign(student, req.body);
    await student.save();
    console.log("Student profile updated successfully");
    res.status(200).json({ message: "Profile updated", student });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "assignedMentor"
    );

    if (!student || !student.assignedMentor) {
      return res.status(400).json({ message: "No assigned mentor found" });
    }

    const mentorId = student.assignedMentor._id;
    const chatMessage = new Chat({
      senderId: req.user._id,
      receiverId: mentorId,
      message,
    });

    await chatMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate(
      "assignedMentor"
    );
    if (!student || !student.assignedMentor) {
      return res.status(400).json({ message: "No assigned mentor found" });
    }

    const mentorId = student.assignedMentor._id;
    const studentId = req.user._id;

    const chatHistory = await Chat.find({
      $or: [
        { senderId: studentId, receiverId: mentorId },
        { senderId: mentorId, receiverId: studentId },
      ],
    }).sort("timestamp");

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};

export const findBestInternship = async (req, res) => {
  try {
    console.log("User from request:", req.user);

    const studentId = req.user?.id;
    if (!studentId)
      return res.status(400).json({ error: "User ID missing in request" });

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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

export const generateStudentReport = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing in request" });
    }

    const student = await Student.findOne({ userId })
      .populate({
        path: "appliedInternships.internship",
        model: "Internship",
      })
      .populate("assignedMentor")
      .exec();

    if (!student) {
      console.log("No student found with this userId:", userId);
      return res.status(404).json({ message: "Student not found" });
    }

    const {
      name,
      department,
      cgpa,
      skills,
      interests,
      achievements,
      certifications,
      preferredRoles,
      locationPreference,
    } = student;

    const internships = student.appliedInternships
      .map(({ internship }) => internship)
      .filter((i) => i); 

    let prompt = `Generate an objective, data-driven evaluation report based on the following student profile.\n`;
    prompt += `Avoid conversational phrases like "Here is a report" or personal comments. Do not reference the student's name in a reflective or narrative tone. Present insights using percentages, bullet points, and structured subheadings.\n\n`;

    prompt += `Student Profile:\n`;
    prompt += `Name: ${name}\nDepartment: ${department}\nCGPA: ${cgpa}\n`;
    prompt += `Skills: ${skills?.join(", ") || "None"}\n`;
    prompt += `Interests: ${interests?.join(", ") || "None"}\n`;
    prompt += `Achievements: ${achievements?.join(", ") || "None"}\n`;
    prompt += `Certifications: ${certifications?.join(", ") || "None"}\n`;
    prompt += `Preferred Roles: ${preferredRoles?.join(", ") || "None"}\n`;
    prompt += `Location Preference: ${locationPreference || "None"}\n\n`;

    if (internships.length > 0) {
      prompt += `Applied Internships:\n`;
      internships.forEach((internship, index) => {
        prompt += `\n${index + 1}. Title: ${internship.title}\n`;
        prompt += `Company: ${internship.company}\n`;
        prompt += `Description: ${internship.description}\n`;
        prompt += `SDG Goals: ${internship.sdgGoals?.join(", ") || "None"}\n`;
        prompt += `Program Outcomes: ${
          internship.programOutcomes?.join(", ") || "None"
        }\n`;
        prompt += `Educational Objectives: ${
          internship.educationalObjectives?.join(", ") || "None"
        }\n`;
        prompt += `Mode: ${internship.mode}, Duration: ${internship.internshipDuration}\n`;
      });
    } else {
      prompt += `No internships applied yet.\n`;
    }

    prompt += `\nInstructions for report:\n`;
    prompt += `- Do not use the student's name in the opening sentence.\n`;
    prompt += `- Use direct and analytical language.\n`;
    prompt += `- Format the output with clear subheadings: Personal Growth, Learning Goal Alignment, SDG Contribution Potential, Career Readiness, Suggested Improvements.\n`;
    prompt += `- Include statistical indicators where possible (e.g., percentage skill match, CGPA benchmark percentile, role relevance scores).\n`;
    prompt += `- Avoid motivational or opinionated phrases. Focus on structured analysis only.\n`;

    prompt += `\nBegin the report below:\n`;

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
        }),
      }
    );

    const result = await geminiResponse.json();

    console.log("Gemini API raw response:", JSON.stringify(result, null, 2));

    if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
      console.error("Gemini error or empty response:", result);
      return res
        .status(500)
        .json({ message: "Failed to generate report", details: result });
    }

    const generatedReport = result.candidates[0].content.parts[0].text;

    res.json({
      studentName: student.name,
      report: generatedReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
