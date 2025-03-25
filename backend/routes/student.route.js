import express from "express";
import {
  applyForInternship,
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("student"));
router.post("/apply/:id", applyForInternship);


export default router;
