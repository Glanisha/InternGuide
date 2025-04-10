import express from "express";
import {
  getInternships,
  applyForInternship,
  trackApplication,
  getMentor,
  trackProgress,
  getFeedback,
  generateReport,
  updateStudentProfile,
  sendMessage,
  getChatHistory,
  findBestInternship,
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.post("/apply/:id", applyForInternship);
router.get("/applications", trackApplication);
router.get("/mentor", getMentor);
router.get("/progress", trackProgress);
router.get("/feedback", getFeedback);
router.get("/report", generateReport);
router.post("/sendMessage", sendMessage);
router.get("/chat", getChatHistory); // Fetch chat history with assigned mentor
router.get("/best-internship", protect, findBestInternship);
router.put("/update", protect, updateStudentProfile); 


export default router;
