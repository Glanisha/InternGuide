import express from "express";
import {
  updateStudentProfile,
  sendMessage,
  getChatHistory,
  submitReview,
  getMyReviews,
  findBestInternship,
  generateStudentReport, getMentorDetails, getCurrentStudent
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.get("/profile", getCurrentStudent);
router.get("/mentordetails", getMentorDetails);
router.post("/sendMessage", sendMessage);
router.get("/chat", getChatHistory); 
router.get("/best-internship", protect, findBestInternship);
router.put("/update", protect, updateStudentProfile); 
router.get("/report",  protect, generateStudentReport);

router.post("/reviews", protect, authorizeRoles("student"),  submitReview);
router.get("/reviews", getMyReviews);


export default router;
