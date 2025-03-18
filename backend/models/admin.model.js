import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["Moderator", "SuperAdmin"], default: "Moderator" },
    managedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" }],
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
