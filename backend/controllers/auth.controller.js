import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import Admin from "../models/admin.model.js";
import Management from "../models/management.model.js";
import Viewer from "../models/viewer.model.js";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (
      (role.toLowerCase() === "student" || role.toLowerCase() === "faculty") &&
      !department
    ) {
      return res
        .status(400)
        .json({ message: "Department is required for students and faculty" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
    });
    await newUser.save();

    if (role.toLowerCase() === "student") {
      const student = new Student({
        userId: newUser._id,
        name,
        email,
        department,
      });
      await student.save();
    } else if (role.toLowerCase() === "faculty") {
      const faculty = new Faculty({
        userId: newUser._id,
        name,
        email,
        department,
      });
      await faculty.save();
    } else if (role.toLowerCase() === "admin") {
      const admin = new Admin({
        userId: newUser._id,
        name,
        email,
        department: null,
      });
      await admin.save();
    } else if (role.toLowerCase() === "management") {
      const management = new Management({ userId: newUser._id, name, email });
      await management.save();
    } else if (role.toLowerCase() === "viewer") {
      const viewer = new Viewer({ userId: newUser._id, name, email });
      await viewer.save();
    }

    const token = generateToken(newUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    console.log("Searching for email:", email);
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let userData;
    switch (user.role.toLowerCase()) {
      case "student":
        userData = await Student.findOne({ userId: user._id }).select(
          "-_id department"
        );
        break;
      case "faculty":
        userData = await Faculty.findOne({ userId: user._id }).select(
          "-_id department"
        );
        break;
      case "admin":
        userData = await Admin.findOne({ userId: user._id }).select("-_id");
        break;
      case "management":
        userData = await Management.findOne({ userId: user._id }).select(
          "-_id reportsGenerated sdgTracking"
        );
        break;
      case "viewer":
        userData = await Viewer.findOne({ userId: user._id }).select("-_id");
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    if (!userData) {
      return res
        .status(400)
        .json({
          message: "Role-specific data not found. Please contact admin.",
        });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
