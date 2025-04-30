import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Viewer",
      required: true,
    },
    message: String,
  requestType: {
    type: String,
    enum: ['message', 'internship', 'become-mentor'],
    required: true
  },
    internshipDetails: {
      title: { type: String },
      company: { type: String },
      description: { type: String },
      role: { type: String },
      requirements: [{ type: String }],
      department: { type: String },
      sdgGoals: [{ type: String }],
      programOutcomes: [{ type: String }],
      educationalObjectives: [{ type: String }],
      location: { type: String },
      mode: {
        type: String,
        enum: ["Remote", "Hybrid", "Onsite"],
        default: "Remote",
      },
      applicationDeadline: { type: Date },
      internshipDuration: { type: String },
      stipend: { type: String },
    },
    mentorDetails: {
      name: String,
      email: String, 
      interests: [String]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;
