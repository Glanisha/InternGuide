const router = express.Router();
import express from "express";
import { 
  protect, 
  authorizeRoles 
} from "../middlewares/auth.middleware.js";
import { 
  updateFacultyProfile, 
  getFacultyMentees, 
  getFacultyAnalytics,
  getFacultyProfile,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../controllers/faculty.controller.js";


router.get("/notifications", protect, authorizeRoles("faculty"), getNotifications);
router.patch("/notifications/:id/read", protect, authorizeRoles("faculty"), markNotificationAsRead);
router.patch("/notifications/read-all", protect, authorizeRoles("faculty"), markAllNotificationsAsRead);

router.put("/update", protect, authorizeRoles("faculty"), updateFacultyProfile);
router.get("/mentees",protect, authorizeRoles("faculty"),  getFacultyMentees);
router.get("/analytics", protect, authorizeRoles("faculty"), getFacultyAnalytics);
router.get("/profile", protect, authorizeRoles("faculty"), getFacultyProfile);
export default router;
