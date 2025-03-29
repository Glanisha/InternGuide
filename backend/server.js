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
import { socketAuth } from "./middlewares/auth.middleware.js"; // Import the modified middleware
import Chat from "./models/chat.model.js"; // Import Chat model

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create HTTP server for Express and Socket.io
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Apply Socket.io authentication middleware
io.use(socketAuth);

// Socket.io chat logic for Student-Mentor communication
io.on("connection", (socket) => {
  console.log(`⚡ A user connected: ${socket.user.id}`);

  socket.on("sendMessage", async ({ receiverId, message }) => {
    try {
      const chatMessage = new Chat({
        senderId: socket.user.id, 
        receiverId, 
        message
      });
      await chatMessage.save();

      // Emit message to the receiver
      io.to(receiverId).emit("receiveMessage", {
        senderId: socket.user.id,
        message
      });

      console.log(`📩 Message from ${socket.user.id} to ${receiverId}: ${message}`);
    } catch (error) {
      console.error("❌ Error saving chat message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user.id}`);
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/faculty", facultyRoutes);

// Start the server
server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
