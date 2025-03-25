import express from "express";
import { createInternship, getAllInternships } from "../controllers/internship.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "faculty"), createInternship);
router.get("/", getAllInternships); 

export default router;
