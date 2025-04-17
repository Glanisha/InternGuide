import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    student: { 
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      name: { type: String, required: true },
      department: { type: String, required: true }
    },
    mentorshipRating: { type: Number, min: 1, max: 5 },
    internshipRating: { type: Number, min: 1, max: 5 },
    sdgAlignmentRating: { type: Number, min: 1, max: 5 },
    industryRelevanceRating: { type: Number, min: 1, max: 5 },
    overallExperience: { type: Number, min: 1, max: 5 },
    strengths: { type: String },
    areasForImprovement: { type: String },
    suggestions: { type: String },
    additionalComments: { type: String },
    isAnonymous: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;


