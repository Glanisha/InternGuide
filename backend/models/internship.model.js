import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    department: { type: String, required: true },
    sdgGoals: [{ type: String }], // Sustainable Development Goals
    programOutcomes: [{ type: String }], // PO mapping
    educationalObjectives: [{ type: String }], // PEO mapping
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", InternshipSchema);
export default Internship;
