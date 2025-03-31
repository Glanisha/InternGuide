import express from "express";
import {
  findBestInternship,
  updateStudentProfile
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.get("/best-internship", protect, findBestInternship);
router.put("/update", protect, updateStudentProfile); 


export default router;
