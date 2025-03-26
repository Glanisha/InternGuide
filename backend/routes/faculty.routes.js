import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { updateFacultyProfile } from "../controllers/faculty.controller.js";

const router = express.Router();

router.put("/update", protect, authorizeRoles("faculty"), updateFacultyProfile);

export default router;
