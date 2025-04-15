// import express from 'express';
// import { getInternshipAnalytics } from "../controllers/management.controller.js";
// import { getViewerRequests, updateRequestStatus } from '../controllers/management.controller.js';
// import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
// import { verifyManagement } from '../middlewares/auth.middleware.js'; // Middleware to ensure only management can access
// import { downloadInternshipReportPDF, downloadInternshipReportExcel } from "../controllers/management.controller.js";

// const router = express.Router();

// // Middleware to verify "management" role
// router.use(verifyManagement);

// router.get('/analytics', protect, authorizeRoles('management'), getInternshipAnalytics);

// // Route to get all viewer requests
// router.get('/requests', getViewerRequests);

// // Route to update the request status
// router.patch('/requests/:id', updateRequestStatus);

// //Route to download pdf and excel of analytics
// router.get('/download-report/pdf', downloadInternshipReportPDF);
// router.get('/download-report/excel', downloadInternshipReportExcel);
// export default router;


import express from "express";
import { 
  getAllFacultyWithMentees,
  getFacultyMenteesDetails,
  generateProgramMetrics,
  trackSDGContributions
} from "../controllers/management.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Faculty and mentee routes
router.get("/faculty", protect, authorizeRoles("management"), getAllFacultyWithMentees);
router.get("/faculty/:facultyId/mentees", protect, authorizeRoles("management"), getFacultyMenteesDetails);

// Program analytics routes
router.get("/program-metrics", protect, authorizeRoles("management"), generateProgramMetrics);
router.get("/sdg-contributions", protect, authorizeRoles("management"), trackSDGContributions);

export default router;