import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";
import axios from "axios";

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
      email
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

    try {
      const students = await Student.find({}, { email: 1 });
      const studentEmails = students.map((student) => student.email);

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { color: #2c3e50; text-align: center; }
        .section { margin-bottom: 20px; }
        .section-title { color: #3498db; border-bottom: 2px solid #eee; padding-bottom: 5px; }
        .highlight-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
        .apply-box { background-color: #e8f4fc; padding: 15px; border-radius: 5px; }
        .footer { margin-top: 20px; font-size: 0.9em; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 New Internship Opportunity! 🎉</h1>
        <h2>${title}</h2>
        <h3><em>at ${company}</em></h3>
    </div>

    <div class="highlight-box">
        <h3 class="section-title">Position Details</h3>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Duration:</strong> ${internshipDuration}</p>
        <p><strong>Application Deadline:</strong> ${applicationDeadline}</p>
    </div>

    <div class="section">
        <h3 class="section-title">Description</h3>
        <p>${description}</p>
    </div>

    <div class="section">
        <h3 class="section-title">Requirements</h3>
        <p>${requirements}</p>
    </div>

    <div class="section">
        <h3 class="section-title">SDG Goals</h3>
        <p>${sdgGoals}</p>
    </div>

    <div class="highlight-box">
        <h3 class="section-title">Educational Components</h3>
        <p><strong>Program Outcomes:</strong> ${programOutcomes}</p>
        <p><strong>Educational Objectives:</strong> ${educationalObjectives}</p>
    </div>

    <div class="apply-box">
        <h3 class="section-title">How to Apply</h3>
        <p>Please check your student portal or contact your mentor for application details.</p>
    </div>

    <p style="font-weight: bold; text-align: center; margin: 20px 0;">
        Don't miss this exciting opportunity to gain valuable experience!
    </p>

    <div class="footer">
        <p>Best regards,<br>The Internship Team<br>Ft. Conceicao Rodrigues College of Engineering</p>
    </div>
</body>
</html>
`;
     
      await axios.post("http://localhost:8001/sendEmail", {
        email: studentEmails,
        text: emailHtml,
        contentType: "text/html", 
      });
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    res
      .status(201)
      .json({
        message: "Internship created successfully",
        internship: newInternship,
      });
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
    const updatedInternship = await Internship.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res
      .status(200)
      .json({
        message: "Internship updated successfully",
        internship: updatedInternship,
      });
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

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await student.save();

    res.status(200).json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
