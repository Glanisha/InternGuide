require('dotenv').config(); // To load .env variables
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); 
const asyncHandler = require('express-async-handler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  methods: ['POST', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type'],
}));
// Setup transporter with more detailed configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // App password (not your regular password)
  },
  tls: {
    rejectUnauthorized: false // Helps in some environments with certificate issues
  },
  debug: true // Enable debugging for troubleshooting
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send messages');
  }
});


// Send Email API
app.post('/sendEmail', asyncHandler(async (req, res) => {
  console.log('Request body:', req.body); // <- Add this

  const { email, text } = req.body;
  if (!email || !text) {
    console.log('Missing email or text'); // <- Add this
    res.status(400).json({ message: 'Email and text are required' });
    return;
  }

  try {
    // Add more fields and options for better deliverability
    const info = await transporter.sendMail({
      from: `"InternGuide" <${process.env.EMAIL_USER}>`, // Formatted sender with name
      to: email,
      subject: 'Message from InternGuide App',
      text: text,
      html: `<p>${text}</p>`, // Adding HTML version improves deliverability
      headers: {
        'Priority': 'high'
      }
    });

    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
}));

// Testing endpoint to verify email configuration
app.get('/testEmail', asyncHandler(async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email',
      text: 'This is a test email to verify the email service is working.'
    });
    
    res.status(200).json({ 
      message: 'Test email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      message: 'Test email failed', 
      error: error.message 
    });
  }
}));

// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email configuration: Using ${process.env.EMAIL_USER}`);
});