import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import internshipRoutes from "./routes/internship.routes.js";
import { socketAuth } from "./middlewares/auth.middleware.js";
import Chat from "./models/chat.model.js";
import Student from "./models/student.model.js";
import adminRoutes from "./routes/admin.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import chatRoutes from "./routes/chat.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create HTTP server for Express and Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.use(socketAuth);

io.on("connection", async (socket) => {
  console.log(`⚡ User connected: ${socket.user.id}`);

  try {
    const student = await Student.findOne({ userId: socket.user.id }).populate("assignedMentor");

    if (!student || !student.assignedMentor) {
      console.log(`❌ No mentor assigned for Student ID: ${socket.user.id}`);
      return socket.disconnect();
    }

    const mentorId = student.assignedMentor._id.toString();
    const studentId = socket.user.id.toString();

    // Log connection details
    console.log(`👥 Student ID: ${studentId} is now connected with Mentor ID: ${mentorId}`);

    // Create a unique chat room for student and mentor
    const room = `chat_${studentId}_${mentorId}`;
    socket.join(room);
    console.log(`User ${studentId} joined room: ${room}`);

    // Fetch and send previous chat history
    const messages = await Chat.find({
      $or: [
        { senderId: studentId, receiverId: mentorId },
        { senderId: mentorId, receiverId: studentId }
      ]
    }).sort({ createdAt: 1 });

    socket.emit("previousMessages", messages);

    // Listen for new messages
    socket.on("sendMessage", async ({ message }) => {
      try {
        const chatMessage = new Chat({
          senderId: studentId,
          receiverId: mentorId,
          message
        });
        await chatMessage.save();

        // Emit message to both student and mentor in the room
        io.to(room).emit("receiveMessage", chatMessage);
        console.log(`📩 Message from Student (${studentId}) to Mentor (${mentorId}): ${message}`);
      } catch (error) {
        console.error("Error saving chat message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Student ID: ${studentId} disconnected.`);
    });
  } catch (error) {
    console.error("Error handling chat connection:", error);
    socket.disconnect();
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
