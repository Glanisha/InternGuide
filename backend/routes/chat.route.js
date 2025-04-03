import express from "express";
import Chat from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get chat history between two users
router.get("/", protect, async (req, res) => {
  try {
    const { studentId, mentorId } = req.query;
    if (!studentId || !mentorId) {
      return res.status(400).json({ message: "Both studentId and mentorId are required." });
    }

    const messages = await Chat.find({
      $or: [
        { senderId: studentId, receiverId: mentorId },
        { senderId: mentorId, receiverId: studentId }
      ]
    }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
