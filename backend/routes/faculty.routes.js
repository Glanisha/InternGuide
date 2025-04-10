import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { updateFacultyProfile, getFacultyMentees } from "../controllers/faculty.controller.js";

const router = express.Router();

router.put("/update", protect, authorizeRoles("faculty"), updateFacultyProfile);
router.get("/mentees",protect, authorizeRoles("faculty"),  getFacultyMentees);

export default router;
