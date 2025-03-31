import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import internshipRoutes from "./routes/internship.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import applicationRoutes from './routes/application.routes.js';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/applications', applicationRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
