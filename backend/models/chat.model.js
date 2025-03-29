import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);
