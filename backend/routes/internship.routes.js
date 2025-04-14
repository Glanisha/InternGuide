import express from "express";
import { createInternship, getAllInternships , updateInternship, deleteInternship} from "../controllers/internship.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

import {
  applyForInternship,
  updateApplicationStatus
} from "../controllers/internship.controller.js";
// import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createInternship);
router.get("/", getAllInternships); 
router.put("/update/:id", protect, authorizeRoles("admin"), updateInternship);
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteInternship);

// router.post(
//     "/:internshipId/apply",
//     protect,
//     authorizeRoles("student"),
//     upload.single("resume"),
//     applyForInternship
//   );
  
  // router.patch(
  //   "/:internshipId/application/:studentId/status",
  //   protect,
  //   authorizeRoles("admin"),
  //   updateApplicationStatus
  // );
export default router;
