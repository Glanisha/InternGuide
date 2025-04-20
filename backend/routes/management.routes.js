import express from "express";
import { 
  getAllFacultyWithMentees,
  getFacultyMenteesDetails,
  generateProgramMetrics,
  trackSDGContributions, 
  generateInternshipReport,
  getReviews,
  updateReviewStatus,
  getReviewAnalytics
} from "../controllers/management.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();



router.use(protect, authorizeRoles("management"));
router.get("/reviews", getReviews);
router.put("/reviews/:id/status", updateReviewStatus);
router.get("/reviews/analytics", getReviewAnalytics);

// Faculty and mentee routes
router.get("/faculty", protect, authorizeRoles("management"), getAllFacultyWithMentees);
router.get("/faculty/:facultyId/mentees", protect, authorizeRoles("management"), getFacultyMenteesDetails);

// Program analytics routes
router.get("/program-metrics", protect, authorizeRoles("management"), generateProgramMetrics);
router.get("/sdg-contributions", protect, authorizeRoles("management"), trackSDGContributions);
router.get("/generate", protect, authorizeRoles("management"), generateInternshipReport);




export default router;