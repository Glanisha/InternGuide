import express from "express";
import {
  getInternships,
  applyForInternship,
  trackApplication,
  getMentor,
  trackProgress,
  getFeedback,
  generateReport,
  updateStudentProfile
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.post("/apply/:id", applyForInternship);
router.get("/applications", trackApplication);
router.get("/mentor", getMentor);
router.get("/progress", trackProgress);
router.get("/feedback", getFeedback);
router.get("/report", generateReport);
router.put("/update", protect, updateStudentProfile); 
router.post("/sendMessage", protect, sendMessage);
router.get("/chat/:mentorId", protect, getChatHistory);

export default router;
