import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String }, 
    requirements: [{ type: String }],
    department: { type: String },
    sdgGoals: [{ type: String }], 
    programOutcomes: [{ type: String }],
    educationalObjectives: [{ type: String }], 
    email: { type: String },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    applications: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Application" 
    }],
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    }, 
    location: { type: String },
    mode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"], 
      default: "Remote"
    }, 
    applicationDeadline: { type: Date }, 
    internshipDuration: { type: String },
    stipend: { type: String },
    assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
  },
  { timestamps: true }
);
const Internship = mongoose.model("Internship", InternshipSchema);
export default Internship;
