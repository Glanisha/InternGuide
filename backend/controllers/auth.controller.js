import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import Student from "../models/student.model.js";
import Faculty from "../models/faculty.model.js";
import Admin from "../models/admin.model.js";

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

    // Ensure department is provided for student and faculty roles
    if ((role.toLowerCase() === "student" || role.toLowerCase() === "faculty") && !department) {
      return res.status(400).json({ message: "Department is required for students and faculty" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the generic User model
    const newUser = new User({ name, email, password: hashedPassword, role: role.toLowerCase() });
    await newUser.save();

    // Store the user in the specific model based on role
    if (role.toLowerCase() === "student") {
      console.log("Creating student entry..."); // Debugging line
      const student = new Student({ 
        userId: newUser._id,  // Link to User model
        name, 
        email, 
        department, // Include department
      });
      await student.save();
      console.log("Student saved successfully"); // Debugging line
    } else if (role.toLowerCase() === "faculty") {
      const faculty = new Faculty({ 
        userId: newUser._id, 
        name, 
        email, 
        department, // ✅ Include department
      });
      await faculty.save();
    } else if (role.toLowerCase() === "admin") {
      const admin = new Admin({ 
        userId: newUser._id, 
        name, 
        email, 
        department: null, // Department is not required for admin
      });
      await admin.save();
    }

    // Generate JWT Token
    const token = generateToken(newUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registration:", error); // Debugging line
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
