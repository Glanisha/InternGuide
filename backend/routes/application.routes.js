
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

// routes/application.routes.js
router.post(
  "/:internshipId/apply",
  protect,
  authorizeRoles("student"),
  submitApplication // Removed applicationUpload middleware
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