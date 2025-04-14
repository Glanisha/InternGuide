
import express from "express";
import {
  submitApplication,
  updateApplicationStatus,
  getApplicationDetails,
  getApplicationsForInternship,
  getStudentApplications
} from "../controllers/application.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { applicationUpload } from "../middlewares/upload.middleware.js"; // Changed import

const router = express.Router();

router.post(
  "/:internshipId/apply",
  protect,
  authorizeRoles("student"),
  applicationUpload, // Use our custom middleware
  submitApplication
);
router.get(
  "/my-applications",
  protect,
  authorizeRoles("student"),
  getStudentApplications
);

// Admin routes
router.patch(
  "/:applicationId/status",
  protect,
  authorizeRoles("admin"),
  updateApplicationStatus
);

router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("admin"),
  getApplicationsForInternship
);

router.get(
  "/:applicationId",
  protect,
  authorizeRoles("admin"),
  getApplicationDetails
);

export default router;