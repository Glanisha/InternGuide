// models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Accepted", "Rejected"], 
      default: "Pending" 
    },
    resume: { type: String },
    // Application-specific overrides of student data
    applicationSkills: [{ type: String }],
    applicationInterests: [{ type: String }],
    applicationCgpa: { type: Number },
    applicationAchievements: [{ type: String }],
    applicationCertifications: [{ type: String }],
    customStatement: { type: String }, // Why they want this internship
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);