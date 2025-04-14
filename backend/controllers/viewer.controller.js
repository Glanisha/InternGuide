import Viewer from '../models/viewer.model.js';
import Internship from '../models/internship.model.js';
import mongoose from 'mongoose';
import Request from '../models/request.model.js';

// Get viewer profile
export const getViewerProfile = async (req, res) => {
  try {
    const viewer = await Viewer.findById(req.user.id)
      .populate('savedInternships');
    if (!viewer) return res.status(404).json({ message: 'Viewer not found' });
    res.status(200).json(viewer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update viewer profile
export const updateViewerProfile = async (req, res) => {
  try {
    const { name, email, interests } = req.body;
    const updatedViewer = await Viewer.findByIdAndUpdate(
      req.user.id,
      { name, email, interests },
      { new: true }
    );
    res.status(200).json(updatedViewer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all internships (for viewers)
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find({});
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get internship details
export const getInternshipDetails = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save internship to viewer's profile
export const saveInternship = async (req, res) => {
  try {
    const viewer = await Viewer.findById(req.user.id);
    if (!viewer) return res.status(404).json({ message: 'Viewer not found' });

    if (!viewer.savedInternships.includes(req.params.id)) {
      viewer.savedInternships.push(req.params.id);
      await viewer.save();
    }
    
    res.status(200).json(viewer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove saved internship
export const removeSavedInternship = async (req, res) => {
  try {
    const viewer = await Viewer.findById(req.user.id);
    if (!viewer) return res.status(404).json({ message: 'Viewer not found' });

    viewer.savedInternships = viewer.savedInternships.filter(
      id => id.toString() !== req.params.id
    );
    
    await viewer.save();
    res.status(200).json(viewer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Submit Request
export const submitRequest = async (req, res) => {
  try {
    const { internshipId, message } = req.body;

    const newRequest = new Request({
      internshipId,
      message,
      viewerId: req.user.id,
    });

    await newRequest.save();

    res.status(200).json({ message: "Request submitted successfully", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get viewer's submitted requests
export const getViewerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ viewerId: req.user.id })
      .populate('internshipId', 'title companyName duration stipend') // adjust fields as needed
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};