import mongoose from "mongoose";

const ManagementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    institution: { type: String, required: true },
    reportsGenerated: [{ type: String }],
    sdgTracking: [
      {
        sdg: { type: String },
        contribution: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Management = mongoose.model("Management", ManagementSchema);
export default Management;
