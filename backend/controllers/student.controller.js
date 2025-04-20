import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";
import Chat from "../models/chat.model.js";
import Faculty from "../models/faculty.model.js";
import Notification from "../models/notification.model.js";
import Review from "../models/review.model.js";
import Management from "../models/management.model.js";
import dotenv from "dotenv";
dotenv.config();

export const getCurrentStudent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    const student = await Student.findOne({ userId })
      .populate('assignedMentor', 'name email department designation')
      .populate('appliedInternships.internship', 'title company applicationDeadline');

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    const updates = req.body;
    const oldStudentData = await Student.findOne({ userId: studentId });

    // Update student profile
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: studentId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check for significant changes that should notify faculty
    const facultyMentor = updatedStudent.assignedMentor;
    if (facultyMentor) {
      const notifications = [];

      // Check for internship status changes
      if (updates.appliedInternships) {
        const oldInternships = oldStudentData.appliedInternships || [];
        const newInternships = updatedStudent.appliedInternships || [];
        
        for (let i = 0; i < newInternships.length; i++) {
          const newInternship = newInternships[i];
          const oldInternship = oldInternships.find(
            int => int.internship?.toString() === newInternship.internship?.toString()
          );
          
          if (oldInternship && oldInternship.status !== newInternship.status) {
            notifications.push({
              facultyId: facultyMentor,
              studentId: updatedStudent._id,
              studentName: updatedStudent.name,
              message: `Internship status changed to ${newInternship.status} for ${newInternship.internship?.title || 'an internship'}`,
              type: "internship_status",
              relatedData: {
                internshipId: newInternship.internship,
                oldStatus: oldInternship.status,
                newStatus: newInternship.status
              }
            });
          }
        }
      }

      // Check for new skills
      if (updates.skills && updates.skills.length > (oldStudentData.skills?.length || 0)) {
        const newSkills = updates.skills.filter(
          skill => !oldStudentData.skills?.includes(skill)
        );
        
        if (newSkills.length > 0) {
          notifications.push({
            facultyId: facultyMentor,
            studentId: updatedStudent._id,
            studentName: updatedStudent.name,
            message: `Added new skills: ${newSkills.join(', ')}`,
            type: "skill_added",
            relatedData: {
              newSkills: newSkills
            }
          });
        }
      }

      // Check for new certifications
      if (updates.certifications && updates.certifications.length > (oldStudentData.certifications?.length || 0)) {
        const newCerts = updates.certifications.filter(
          cert => !oldStudentData.certifications?.includes(cert)
        );
        
        if (newCerts.length > 0) {
          notifications.push({
            facultyId: facultyMentor,
            studentId: updatedStudent._id,
            studentName: updatedStudent.name,
            message: `Added new certifications: ${newCerts.join(', ')}`,
            type: "certification_added",
            relatedData: {
              newCertifications: newCerts
            }
          });
        }
      }

      // Check for new achievements
      if (updates.achievements && updates.achievements.length > (oldStudentData.achievements?.length || 0)) {
        const newAchievements = updates.achievements.filter(
          ach => !oldStudentData.achievements?.includes(ach)
        );
        
        if (newAchievements.length > 0) {
          notifications.push({
            facultyId: facultyMentor,
            studentId: updatedStudent._id,
            studentName: updatedStudent.name,
            message: `Added new achievements: ${newAchievements.join(', ')}`,
            type: "achievement_added",
            relatedData: {
              newAchievements: newAchievements
            }
          });
        }
      }

      // General profile updates (if no specific changes detected)
      if (notifications.length === 0 && Object.keys(updates).length > 0) {
        const changedFields = Object.keys(updates).filter(
          field => !['_id', 'createdAt', 'updatedAt', '__v'].includes(field)
        );
        
        if (changedFields.length > 0) {
          notifications.push({
            facultyId: facultyMentor,
            studentId: updatedStudent._id,
            studentName: updatedStudent.name,
            message: `Updated profile fields: ${changedFields.join(', ')}`,
            type: "profile_update",
            relatedData: {
              updatedFields: changedFields
            }
          });
        }
      }

      // Save all notifications
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ error: "Internal server error" });
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

export const getMentorDetails = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming user ID is stored in req.user from auth middleware

    // Find the student to get their assigned mentor
    const student = await Student.findOne({ userId: studentId }).populate('assignedMentor');
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.assignedMentor) {
      return res.status(404).json({ message: "No mentor assigned" });
    }

    // Get the full mentor details
    const mentor = await Faculty.findById(student.assignedMentor._id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({
      success: true,
      mentor
    });

  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





//review stystem with managemnet controllers 



export const submitReview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Use userId instead of _id
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const reviewData = {
      student: {
        id: student._id,
        name: student.name,
        department: student.department
      },
      ...req.body
    };

    const review = await Review.create(reviewData);

    // Add to student's submitted reviews
    await Student.findByIdAndUpdate(student._id, {
      $push: { submittedReviews: { reviewId: review._id } }
    });

    // Add to management's received reviews
    await Management.updateMany({}, {
      $push: { receivedReviews: { reviewId: review._id } }
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id; // ID from the logged-in user token

    // Find student by userId instead of _id
    const student = await Student.findOne({ userId }).populate({
      path: "submittedReviews.reviewId",
      select: "-student.id" // Optional: hides student ID in the review if needed
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      reviews: student.submittedReviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};
