import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    evaluations: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        comments: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", FacultySchema);
export default Faculty;
