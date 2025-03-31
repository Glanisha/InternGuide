import express from "express";
import { assignMentors } from "../controllers/admin.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/assign", protect, authorizeRoles("admin"), assignMentors);


export default router;
