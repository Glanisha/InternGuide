import Faculty from "../models/faculty.model.js";

export const updateFacultyProfile = async (req, res) => {
    try {
        const userId = req.user?.id; 
        console.log("Searching for Faculty with userId:", userId);
  
        if (!userId) {
            return res.status(400).json({ message: "User ID missing in request" });
        }
  
        const faculty = await Faculty.findOne({ userId });
  
        if (!faculty) {
            console.log("❌ No faculty found with this userId");
            return res.status(404).json({ message: "Faculty profile not found" });
        }
  
        Object.assign(faculty, req.body);
        await faculty.save();
        
        console.log("✅ Faculty profile updated successfully");
        res.status(200).json({ message: "Profile updated", faculty });
  
    } catch (error) {
        console.error("❌ Error updating faculty profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
  };
  