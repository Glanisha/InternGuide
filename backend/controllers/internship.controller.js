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
