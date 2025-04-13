import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    facultyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Faculty", 
      required: true 
    },
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student", 
      required: true 
    },
    studentName: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: [
        "internship_status", 
        "skill_added", 
        "certification_added", 
        "achievement_added", 
        "profile_update"
      ], 
      required: true 
    },
    relatedData: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;