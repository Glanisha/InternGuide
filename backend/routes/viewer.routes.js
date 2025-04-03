import express from 'express';
import {
  getViewerProfile,
  updateViewerProfile,
  getAllInternships,
  getInternshipDetails,
  saveInternship,
  removeSavedInternship,
  submitRequest
} from '../controllers/viewer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getViewerProfile)
  .put(protect, updateViewerProfile);

router.route('/internships')
  .get(protect, getAllInternships);

router.route('/internships/:id')
  .get(protect, getInternshipDetails);

router.route('/internships/save/:id')
  .post(protect, saveInternship)
  .delete(protect, removeSavedInternship);

router.route('/request')
  .post(protect, submitRequest);

export default router;