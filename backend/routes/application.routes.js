import express from "express";
import {
  submitApplication,
  updateApplicationStatus,
  getApplicationDetails,
  getApplicationsForInternship,
  getStudentApplications,
  getInternshipsWithApplications,
  getFullApplicationDetails,
  updateApplicationStatusAdmin,
} from "../controllers/application.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student routes
router.post(
  "/:internshipId/apply",
  protect,
  authorizeRoles("student"),
  submitApplication
);

router.get(
  "/my-applications",
  protect,
  authorizeRoles("student"),
  getStudentApplications
);

// Admin routes
router.get(
  "/admin/internships",
  protect,
  authorizeRoles("admin"),
  getInternshipsWithApplications
);

router.get(
  "/admin/:applicationId/full",
  protect,
  authorizeRoles("admin"),
  getFullApplicationDetails
);

router.patch(
  "/admin/:applicationId/status",
  protect,
  authorizeRoles("admin"),
  updateApplicationStatusAdmin
);

// Existing routes (keep these for backward compatibility)
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