import Faculty from "../models/faculty.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";
import Internship from "../models/internship.model.js";
 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

// Get faculty profile
export const getFacultyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID missing in request" });
    }

    const faculty = await Faculty.findOne({ userId })
      .populate('assignedStudents', 'name email department cgpa')
      .populate('internshipsSupervised.internship', 'title company status')
      .populate('internshipsSupervised.students', 'name email')
      .populate('evaluations.student', 'name email');

    if (!faculty) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }

    res.status(200).json({ faculty });
  } catch (error) {
    console.error("Error fetching faculty profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateFacultyProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("Searching for Faculty with userId:", userId);
  
        if (!userId) {
            return res.status(400).json({ message: "User ID missing in request" });
        }
  
        const faculty = await Faculty.findOne({ userId });
  
        if (!faculty) {
            console.log("No faculty found with this userId");
            return res.status(404).json({ message: "Faculty profile not found" });
        }
  
        Object.assign(faculty, req.body);
        await faculty.save();
  
        console.log("Faculty profile updated successfully");
        res.status(200).json({ message: "Profile updated", faculty });
    } catch (error) {
        console.error("Error updating faculty profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
  };
  export const getFacultyMentees = async (req, res) => {
    try {
      console.log("User from request:", req.user);
  
      const facultyId = req.user?.id;
      if (!facultyId) {
        return res.status(400).json({ error: "User ID missing in request" });
      }
  
      const faculty = await Faculty.findOne({ userId: facultyId }).populate({
        path: "assignedStudents",
        populate: {
          path: "appliedInternships.internship",
          model: "Internship"
        }
      });
  
      if (!faculty) {
        console.log("Faculty not found for user ID:", facultyId);
        return res.status(404).json({ error: "Faculty not found" });
      }
  
      // Optional: Just for logging
      console.log("Faculty found:", faculty.name);
  
      // Send fully enriched student data
      res.status(200).json({
        message: "Mentees fetched successfully",
        mentees: faculty.assignedStudents,
      });
  
    } catch (error) {
      console.error("Error fetching faculty mentees:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


export const getFacultyAnalytics = async (req, res) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    // Get faculty with all assigned students and their internship details
    const faculty = await Faculty.findOne({ userId: facultyId })
      .populate({
        path: "assignedStudents",
        populate: [
          {
            path: "appliedInternships.internship",
            model: "Internship"
          },
          {
            path: "progress.internship",
            model: "Internship"
          }
        ]
      });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    // Prepare data for analysis
    const analysisData = {
      facultyName: faculty.name,
      totalMentees: faculty.assignedStudents.length,
      mentees: faculty.assignedStudents.map(student => ({
        name: student.name,
        department: student.department,
        appliedInternships: student.appliedInternships.length,
        acceptedInternships: student.appliedInternships.filter(ai => ai.status === "Accepted").length,
        rejectedInternships: student.appliedInternships.filter(ai => ai.status === "Rejected").length,
        averageCompletion: student.progress.reduce((acc, curr) => acc + curr.completionPercentage, 0) / 
                         (student.progress.length || 1),
        skills: student.skills,
        cgpa: student.cgpa,
        internships: student.appliedInternships.map(ai => ({
          title: ai.internship?.title || "Unknown",
          company: ai.internship?.company || "Unknown",
          status: ai.status,
          sdgGoals: ai.internship?.sdgGoals || [],
          programOutcomes: ai.internship?.programOutcomes || [],
          educationalObjectives: ai.internship?.educationalObjectives || [],
          completion: student.progress.find(p => p.internship?.equals(ai.internship?._id))?.completionPercentage || 0
        }))
      })),
      overallStats: {
        totalInternships: faculty.assignedStudents.reduce((acc, student) => acc + student.appliedInternships.length, 0),
        acceptanceRate: faculty.assignedStudents.reduce((acc, student) => {
          const accepted = student.appliedInternships.filter(ai => ai.status === "Accepted").length;
          return acc + (student.appliedInternships.length > 0 ? (accepted / student.appliedInternships.length) : 0);
        }, 0) / (faculty.assignedStudents.length || 1),
        averageCompletion: faculty.assignedStudents.reduce((acc, student) => {
          return acc + (student.progress.reduce((sAcc, p) => sAcc + p.completionPercentage, 0) / 
                      (student.progress.length || 1));
        }, 0) / (faculty.assignedStudents.length || 1)
      }
    };

    // Prepare prompt for GeminiF
const prompt = `
Analyze the following faculty mentee internship data and provide insights ONLY on:
1. Comparative performance of mentees in their internships (based on available data)
2. Status updates and progress tracking (only for internships with data)
3. SDG/PO/PEO alignment (only for internships where these fields exist)
4. Success rates and academic alignment (based on available metrics)
5. Any notable patterns or outliers in the existing data
6. Provide a mentor impact score based on the success of students 
7. Recommendations for the faculty to improve student internship outcomes
8. Give personalised insight on each mentee that helps faculty understand their performance better
9. Provide a summary of the overall performance of the faculty's mentees  

Important Rules:
- ONLY analyze fields that contain actual data (ignore empty arrays or "Unknown" values)
- NEVER suggest improving data collection or mention missing data
- Focus exclusively on analyzing what's present
- If a field is empty/unknown, don't draw conclusions from it
- For "Unknown" company/title, simply ignore those internships in analysis
- Do not metion any imporvemnt based on internship data collection as that doesnt influence our student

Return the analysis in JSON format with these sections:
- comparative_performance (array comparing students with actual data)
- status_progress_analysis (only for internships with known status)
- alignment_analysis (only for internships with SDG/PO/PEO data)
- success_metrics (only calculable metrics)
- recommendations (only actionable items based on existing data)

Data to analyze:
${JSON.stringify(analysisData, null, 2)}
`;
    // Construct the API URL with API key as query parameter
    const apiUrl = new URL(process.env.GEMINI_API_URL);
    apiUrl.searchParams.append('key', process.env.GEMINI_API_KEY);

    // Call Gemini API with proper authentication
    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorDetails}`);
    }

    const result = await response.json();
    
    // Extract the generated content from Gemini response
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                       result.predictions?.[0]?.content || 
                       JSON.stringify(result);
    
    let analysis;
    try {
      analysis = typeof analysisText === "string" ? JSON.parse(analysisText) : analysisText;
    } catch (e) {
      analysis = { analysis: analysisText };
    }

    // Combine raw data with AI analysis
    const responseData = {
      rawData: analysisData,
      analysis: analysis
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error in faculty analytics:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      debug: {
        apiUrl: process.env.GEMINI_API_URL,
        apiKeyPresent: !!process.env.GEMINI_API_KEY
      }
    });
  }
};


// Get all notifications for faculty
export const getNotifications = async (req, res) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    const faculty = await Faculty.findOne({ userId: facultyId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const notifications = await Notification.find({ facultyId: faculty._id })
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email department');

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user?.id;

    if (!facultyId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    const faculty = await Faculty.findOne({ userId: facultyId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, facultyId: faculty._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) {
      return res.status(400).json({ error: "User ID missing in request" });
    }

    const faculty = await Faculty.findOne({ userId: facultyId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const result = await Notification.updateMany(
      { facultyId: faculty._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: `Marked ${result.modifiedCount} notifications as read`
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};