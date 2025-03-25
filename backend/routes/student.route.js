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

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.get("/internships", getInternships);
router.post("/internships/apply/:id", applyForInternship);
router.get("/applications", trackApplication);
router.get("/mentor", getMentor);
router.get("/progress", trackProgress);
router.get("/feedback", getFeedback);
router.get("/report", generateReport);
router.put("/update", protect, updateStudentProfile); 

export default router;
