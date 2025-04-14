import express from 'express';
import { getInternshipAnalytics } from "../controllers/management.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/analytics', protect, authorizeRoles('management'), getInternshipAnalytics);

export default router;
