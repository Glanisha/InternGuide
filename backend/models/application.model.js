// models/Application.model.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student", 
      required: true 
    },
    internship: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Internship", 
      required: true 
    },
    resume: { 
      type: String, 
      required: true 
    },
    coverLetter: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Accepted", "Rejected", "Under Review"], 
      default: "Pending" 
    },
    additionalDocuments: [{ 
      type: String 
    }],
    feedback: {
      fromAdmin: { type: String },
      fromStudent: { type: String },
      rating: { type: Number, min: 1, max: 5 }
    },
    applicationDate: { 
      type: Date, 
      default: Date.now 
    },
    decisionDate: { 
      type: Date 
    }
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;