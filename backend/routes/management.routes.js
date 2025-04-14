import express from 'express';
import { getInternshipAnalytics } from "../controllers/management.controller.js";
import { getViewerRequests, updateRequestStatus } from '../controllers/management.controller.js';
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { verifyManagement } from '../middlewares/auth.middleware.js'; // Middleware to ensure only management can access

const router = express.Router();

// Middleware to verify "management" role
router.use(verifyManagement);

router.get('/analytics', protect, authorizeRoles('management'), getInternshipAnalytics);

// Route to get all viewer requests
router.get('/requests', getViewerRequests);

// Route to update the request status
router.patch('/requests/:id', updateRequestStatus);

export default router;