import Faculty from "../models/faculty.model.js";
import Student from "../models/student.model.js";


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
  