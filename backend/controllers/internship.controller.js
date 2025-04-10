import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";

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
  export const applyForInternship = async (req, res) => {
    try {
      console.log("Incoming request to apply for internship");
  
      const { internshipId } = req.params;
      console.log("internshipId from params:", internshipId);
  
      const studentId = req.user?.id; 
      console.log("studentId from token (req.user.id):", studentId);
  
      const resumePath = req.file?.path;
      console.log("Uploaded resume path:", resumePath);
  
      const internship = await Internship.findById(internshipId);
      console.log("Internship fetched from DB:", internship);
  
      if (!internship) {
        console.log("Internship not found for ID:", internshipId);
        return res.status(404).json({ message: "Internship not found" });
      }
  
      const student = await Student.findOne({ userId: studentId });
      console.log("Student fetched from DB:", student);
  
      if (!student) {
        console.log("Student not found for userId:", studentId);
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Prevent reapplying
      const alreadyApplied = student.appliedInternships.some(
        (app) => app.internship.toString() === internshipId
      );
      if (alreadyApplied) {
        console.log("Student has already applied to this internship");
        return res.status(400).json({ message: "Already applied" });
      }
  
      // Update student doc
      student.appliedInternships.push({
        internship: internship._id,
        status: "Pending",
      });
  
      if (resumePath) {
        student.resume = resumePath;
      }
  
      await student.save();
      console.log("Student application saved");

      internship.applicants.push(student._id);
      await internship.save();
      console.log("Internship applicant list updated");
  
      res.status(200).json({ message: "Internship application submitted!" });
    } catch (err) {
      console.error("Server error during internship application:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

export const updateApplicationStatus = async (req, res) => {
  const { studentId, internshipId } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const student = await Student.findOne({ _id: studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const application = student.appliedInternships.find(
      (app) => app.internship.toString() === internshipId
    );

    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await student.save();

    res.status(200).json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


  
  