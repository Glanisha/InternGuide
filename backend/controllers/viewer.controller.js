import Viewer from '../models/viewer.model.js';
import Internship from '../models/internship.model.js';
import Request from '../models/request.model.js';

// Get viewer profile
export const getViewerProfile = async (req, res) => {
  try {
    const viewer = await Viewer.findOne({ userId: req.user._id })
      .populate('savedInternships')
      .populate('userId');

    if (!viewer) {
      return res.status(404).json({ message: 'Viewer not found' });
    }

    res.status(200).json(viewer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update viewer profile
export const updateViewerProfile = async (req, res) => {
  try {
    const { name, email, interests } = req.body;
    const updatedViewer = await Viewer.findOneAndUpdate(
      { userId: req.user._id },
      { name, email, interests },
      { new: true }
    );
    
    if (!updatedViewer) {
      return res.status(404).json({ message: 'Viewer not found' });
    }
    
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
    const viewer = await Viewer.findOne({ userId: req.user._id });
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
    const viewer = await Viewer.findOne({ userId: req.user._id });
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

// Viewer submits request
export const submitRequest = async (req, res) => {
  try {
    const viewer = await Viewer.findOne({ userId: req.user._id });
    if (!viewer) return res.status(404).json({ message: 'Viewer not found' });

    const viewerId = viewer._id; // Use the actual viewer document ID
    const { requestType, internshipDetails, message } = req.body;

    // Check if the requestType is provided
    if (!requestType) {
      return res.status(400).json({ message: 'Request type is required' });
    }

    // Create the request object dynamically
    const newRequest = new Request({
      viewerId,
      requestType, // Add the requestType field
      message,
      ...(internshipDetails && Object.keys(internshipDetails).length > 0 && { internshipDetails })
    });

    await newRequest.save();

    res.status(201).json({
      message: internshipDetails ? "Internship request submitted successfully" : "Message request submitted successfully",
      request: newRequest
    });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
};




// Get viewer's submitted requests
export const getViewerRequests = async (req, res) => {
  try {
    const viewer = await Viewer.findOne({ userId: req.user._id });
    if (!viewer) return res.status(404).json({ message: 'Viewer not found' });
    
    const requests = await Request.find({ viewerId: viewer._id })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};