import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { updateFacultyProfile, getFacultyMentees, getFacultyAnalytics , getFacultyProfile} from "../controllers/faculty.controller.js";

const router = express.Router();

router.put("/update", protect, authorizeRoles("faculty"), updateFacultyProfile);
router.get("/mentees",protect, authorizeRoles("faculty"),  getFacultyMentees);
router.get("/analytics", protect, authorizeRoles("faculty"), getFacultyAnalytics);
router.get("/profile", protect, authorizeRoles("faculty"), getFacultyProfile);
export default router;
