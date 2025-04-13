
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    faculty: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Faculty", 
      required: true 
    },
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student", 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    replies: [
      {
        sender: { 
          type: String, 
          enum: ["faculty", "student"], 
          required: true 
        },
        message: { 
          type: String, 
          required: true 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        }
      }
    ],
    isPrivate: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;