// chat-system.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import { ChatMessage, Conversation } from './models/Chat.js';
import cors from 'cors';

// Configuration
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  sender: { 
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['student', 'faculty'], required: true }
  },
  receiver: { 
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['student', 'faculty'], required: true }
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
}, { timestamps: true });

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['student', 'faculty'], required: true }
  }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

// API Routes

// Get conversations for a user (student or faculty)
app.get('/api/conversations/:userId/:role', async (req, res) => {
  try {
    const { userId, role } = req.params;
    
    const conversations = await Conversation.find({
      'participants.id': mongoose.Types.ObjectId(userId),
      'participants.role': role
    })
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    // Get participant details for each conversation
    const enhancedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherParticipant = conv.participants.find(
        p => p.id.toString() !== userId || p.role !== role
      );
      
      let participantDetails = null;
      if (otherParticipant.role === 'student') {
        participantDetails = await Student.findById(otherParticipant.id).select('name department');
      } else {
        participantDetails = await Faculty.findById(otherParticipant.id).select('name department');
      }
      
      return {
        ...conv.toObject(),
        otherParticipant: participantDetails
      };
    }));
    
    res.json(enhancedConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a specific conversation
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await ChatMessage.find({ conversationId })
      .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or get conversation between two users
app.post('/api/conversations', async (req, res) => {
  try {
    const { senderId, senderRole, receiverId, receiverRole } = req.body;
    
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { id: mongoose.Types.ObjectId(senderId), role: senderRole } },
          { $elemMatch: { id: mongoose.Types.ObjectId(receiverId), role: receiverRole } }
        ]
      }
    });
    
    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { id: senderId, role: senderRole },
          { id: receiverId, role: receiverRole }
        ]
      });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all faculty members (for student to choose from)
app.get('/api/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find().select('name department areasOfExpertise designation');
    res.json(faculty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all students (for faculty to choose from)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().select('name department skills interests');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students mentored by a specific faculty
app.get('/api/faculty/:facultyId/students', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findById(facultyId).populate('assignedStudents');
    res.json(faculty.assignedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a student's assigned mentor
app.get('/api/students/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('assignedMentor');
    res.json(student.assignedMentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Socket.io chat implementation
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room for private messaging
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle new messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const { senderId, senderRole, receiverId, receiverRole, message, conversationId } = messageData;
      
      // Save message to database
      const newMessage = await ChatMessage.create({
        sender: { id: senderId, role: senderRole },
        receiver: { id: receiverId, role: receiverRole },
        message,
        conversationId
      });
      
      // Update conversation with last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        updatedAt: new Date()
      });
      
      // Emit message to sender and receiver
      io.to(receiverId).emit('newMessage', newMessage);
      io.to(senderId).emit('messageSent', newMessage);
      
      console.log(`Message sent from ${senderRole} ${senderId} to ${receiverRole} ${receiverId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });
  
  // Mark messages as read
  socket.on('markAsRead', async (data) => {
    try {
      const { conversationId, userId } = data;
      
      // Update all unread messages in the conversation for this user
      await ChatMessage.updateMany(
        { 
          conversationId,
          'receiver.id': userId,
          read: false
        },
        { read: true }
      );
      
      socket.emit('messagesMarkedAsRead', { conversationId });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });
  
  // User is typing indicator
  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit('userTyping', { userId: senderId });
  });
  
  // User stopped typing
  socket.on('stopTyping', (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit('userStoppedTyping', { userId: senderId });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export models for use in other files
export { ChatMessage, Conversation };