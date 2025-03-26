import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    qualifications: [
      {
        degree: { type: String, required: true }, 
        institution: { type: String, required: true },
        year: { type: Number, required: true },
      },
    ],
    yearOfExperience: { type: Number, default: 0 }, 
    areasOfExpertise: [{ type: String }],
    designation: { type: String},
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    internshipsSupervised: [
      {
        internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
      },
    ],
    evaluations: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        comments: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    isAvailableForMentoring: { type: Boolean, default: true }, 
    mentoringCapacity: { type: Number, default: 5 }, 
    researchInterests: [{ type: String }], 
    publications: [
      {
        title: { type: String, required: true }, 
        journal: { type: String, required: true }, 
        year: { type: Number, required: true },
      },
    ],
    contactNumber: { type: String },
    linkedInProfile: { type: String },
    profilePicture: { type: String }, 
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", FacultySchema);
export default Faculty;
