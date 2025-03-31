import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
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
  applicationDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["Submitted", "Under Review", "Shortlisted", "Interview", "Rejected", "Accepted"], 
    default: "Submitted" 
  },
  resume: { 
    type: String, 
    required: true 
  },
  coverLetter: { 
    type: String 
  },
  additionalDocuments: [{ 
    type: String 
  }],
  answers: [{ 
    question: String, 
    answer: String 
  }],
  adminComments: { 
    type: String 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;