import express from "express";
import { createInternship, getAllInternships , updateInternship, deleteInternship} from "../controllers/internship.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createInternship);
router.get("/", getAllInternships); 
router.put("/update/:id", protect, authorizeRoles("admin"), updateInternship);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteInternship);

export default router;
