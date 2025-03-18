import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/student-dashboard", protect, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Welcome to Student Dashboard" });
});

router.get("/faculty-dashboard", protect, authorizeRoles("faculty"), (req, res) => {
  res.json({ message: "Welcome to Faculty Dashboard" });
});

router.get("/admin-dashboard", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/management-dashboard", protect, authorizeRoles("management"), (req, res) => {
  res.json({ message: "Welcome to Management Dashboard" });
});

export default router;
