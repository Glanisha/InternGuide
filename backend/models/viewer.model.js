import mongoose from "mongoose";

const ViewerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, unique: true, required: true },
    interests: [{ type: String }], 
    savedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" }],
  },
  { timestamps: true }
);

const Viewer = mongoose.model("Viewer", ViewerSchema);
export default Viewer;

