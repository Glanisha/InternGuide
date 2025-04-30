import express from "express";
import {
  giveFeedback,
  addReply,
  getStudentFeedback,
  getFacultyFeedback
} from "../controllers/feedback.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Faculty routes
router.post("/", protect, authorizeRoles("faculty"), giveFeedback);
router.get("/faculty", protect, authorizeRoles("faculty"), getFacultyFeedback);

// Student routes
router.get("/student", protect, authorizeRoles("student"), getStudentFeedback);
router.post("/reply", protect, authorizeRoles("student"), addReply);

export default router;