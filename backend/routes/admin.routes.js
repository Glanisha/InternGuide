import express from "express";
import { getPendingRequests, approveRequest, rejectRequest, assignMentors , confirmMentors,  getDashboardStats } from "../controllers/admin.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin", "management"), getDashboardStats);
router.get("/assign", protect, authorizeRoles("admin"), assignMentors);
router.post('/confirm-mentors',protect, authorizeRoles("admin"), confirmMentors);
router.get("/pending-requests", protect, authorizeRoles("admin"), getPendingRequests);
router.post("/approve-request/:requestId", protect, authorizeRoles("admin"), approveRequest);
router.post("/reject-request/:requestId", protect, authorizeRoles("admin"), rejectRequest);

export default router;
