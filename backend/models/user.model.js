import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "student", "faculty", "admin", "management"],
      required: true,
    },
  },
  { timestamps: true }
);


UserSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    console.log(`Deleting user and associated ${this.role} data...`);

    switch (this.role) {
      case "student":
        await Student.deleteOne({ userId: this._id });
        break;
      case "faculty":
        await Faculty.deleteOne({ userId: this._id });
        break;
      case "admin":
        await Admin.deleteOne({ userId: this._id });
        break;
      case "management":
        await Management.deleteOne({ userId: this._id });
        break;
      case "viewer":
        await Viewer.deleteOne({ userId: this._id });
        break;
      default:
        console.log("No associated role data found.");
    }
    
    next();
  } catch (error) {
    console.error("Error deleting associated role data:", error);
    next(error);
  }
});


const User = mongoose.model("User", UserSchema);
export default User;
