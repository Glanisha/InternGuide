import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    qualifications: [
      {
        degree: { type: String, required: true }, // e.g., "PhD in Computer Science"
        institution: { type: String, required: true }, // e.g., "Stanford University"
        year: { type: Number, required: true }, // e.g., 2015
      },
    ],
    yearOfExperience: { type: Number, default: 0 }, // Total years of experience
    areasOfExpertise: [{ type: String }], // e.g., ["Machine Learning", "Data Structures"]
    designation: { type: String, required: true }, // e.g., "Professor", "Associate Professor"
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    evaluations: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        comments: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    isAvailableForMentoring: { type: Boolean, default: true }, // Indicates if the faculty is available for mentoring
    mentoringCapacity: { type: Number, default: 5 }, // Maximum number of students the faculty can mentor
    researchInterests: [{ type: String }], // e.g., ["Artificial Intelligence", "Cybersecurity"]
    publications: [
      {
        title: { type: String, required: true }, // e.g., "A Study on Neural Networks"
        journal: { type: String, required: true }, // e.g., "IEEE Transactions on AI"
        year: { type: Number, required: true }, // e.g., 2022
      },
    ],
    contactNumber: { type: String }, // e.g., "+1-123-456-7890"
    linkedInProfile: { type: String }, // e.g., "https://linkedin.com/in/johndoe"
    profilePicture: { type: String }, 
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", FacultySchema);
export default Faculty;
