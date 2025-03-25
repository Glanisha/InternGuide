import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    department: { type: String, required: true },
    sdgGoals: [{ type: String }], 
    programOutcomes: [{ type: String }],
    educationalObjectives: [{ type: String }], 
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    }, 
    applicationDeadline: { type: Date }, 
    internshipDuration: { type: String },
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", InternshipSchema);
export default Internship;
