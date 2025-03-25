import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User model
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    department: { type: String, required: true }, // Ensure department is required
    appliedInternships: [
      {
        internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
      },
    ],
    assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    progress: [
      {
        internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
        milestones: [{ type: String }],
        completionPercentage: { type: Number, default: 0 },
      },
    ],
    feedback: [
      {
        mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
        comments: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    skills: [{ type: String }], // New field: Skills
    interests: [{ type: String }], // New field: Interests
    cgpa: { type: Number, min: 0, max: 10 }, // New field: CGPA
    resume: { type: String }, // New field: Resume URL
    achievements: [{ type: String }], 
    phoneNumber: { type: String },
    linkedinProfile: { type: String }, // New field: LinkedIn profile
    portfolioWebsite: { type: String },
    certifications: [{ type: String }], 
    availability: { type: String, enum: ["Part-time", "Full-time", "Internship"] }, // New field: Availability
    preferredRoles: [{ type: String }], // New field: Job roles student is interested in
    locationPreference: { type: String }, // New field: Remote, Hybrid, or Preferred cities
    references: [{ type: String }],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
export default Student;
