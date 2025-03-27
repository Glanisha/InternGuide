import Internship from "../models/internship.model.js";

export const createInternship = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      department,
      sdgGoals,
      programOutcomes,
      educationalObjectives,
      applicationDeadline,
      internshipDuration,
    } = req.body;

    const newInternship = new Internship({
      title,
      company,
      description,
      requirements,
      department,
      sdgGoals,
      programOutcomes,
      educationalObjectives,
      applicationDeadline,
      internshipDuration,
    });

    await newInternship.save();
    res.status(201).json({ message: "Internship created successfully", internship: newInternship });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllInternships = async (req, res) => {
    try {
      const internships = await Internship.find();
      res.status(200).json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  export const updateInternship = async (req, res) => {
    try {
      const { id } = req.params; 
      const updates = req.body;
      const updatedInternship = await Internship.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  
      if (!updatedInternship) {
        return res.status(404).json({ message: "Internship not found" });
      }
  
      res.status(200).json({ message: "Internship updated successfully", internship: updatedInternship });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  export const deleteInternship = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedInternship = await Internship.findByIdAndDelete(id);
  
      if (!deletedInternship) {
        return res.status(404).json({ message: "Internship not found" });
      }
  
      res.status(200).json({ message: "Internship deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  