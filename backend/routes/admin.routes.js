import express from "express";
import { assignMentors , confirmMentors} from "../controllers/admin.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/assign", protect, authorizeRoles("admin"), assignMentors);
router.post('/confirm-mentors',protect, authorizeRoles("admin"), confirmMentors);

export default router;
