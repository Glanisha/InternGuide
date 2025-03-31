import express from 'express';
import Application from '../models/application.model.js';
import upload from '../config/multer.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply for internship (Student)
router.post(
  '/apply',
  protect,
  authorizeRoles('student'),
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { internshipId, coverLetterText, answers } = req.body;
      
      if (!req.files.resume) {
        return res.status(400).json({ message: 'Resume is required' });
      }

      const application = new Application({
        student: req.user.id,
        internship: internshipId,
        resume: req.files.resume[0].path,
        coverLetter: req.files.coverLetter ? req.files.coverLetter[0].path : null,
        additionalDocuments: req.files.additionalDocuments 
          ? req.files.additionalDocuments.map(file => file.path) 
          : [],
        coverLetterText,
        answers: JSON.parse(answers)
      });

      await application.save();
      
      // Update student's appliedInternships
      await Student.findByIdAndUpdate(req.user.id, {
        $push: {
          appliedInternships: {
            internship: internshipId,
            status: "Submitted"
          }
        }
      });

      // Update internship's applicants
      await Internship.findByIdAndUpdate(internshipId, {
        $push: { applicants: req.user.id }
      });

      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all applications (Admin)
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email department')
      .populate('internship', 'title company');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's applications (Student)
router.get('/my-applications', protect, authorizeRoles("student"), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('internship', 'title company status applicationDeadline');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (Admin)
router.put('/:id/status', protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminComments,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    // Update student's application status
    await Student.updateOne(
      { _id: application.student, "appliedInternships.internship": application.internship },
      { $set: { "appliedInternships.$.status": status } }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;