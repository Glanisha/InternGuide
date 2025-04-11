import express from "express";
import {
  getInternships,
  applyForInternship,
  trackApplication,
  getMentor,
  trackProgress,
  getFeedback,
  updateStudentProfile,
  sendMessage,
  getChatHistory,
  findBestInternship,
  generateStudentReport, getMentorDetails
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.post("/apply/:id", applyForInternship);
router.get("/applications", trackApplication);
router.get("/mentordetails", getMentorDetails);
router.get("/progress", trackProgress);
router.get("/feedback", getFeedback);
router.post("/sendMessage", sendMessage);
router.get("/chat", getChatHistory); 
router.get("/best-internship", protect, findBestInternship);
router.put("/update", protect, updateStudentProfile); 
router.get("/report",  protect, generateStudentReport);


export default router;
