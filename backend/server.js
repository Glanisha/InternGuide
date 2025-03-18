import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", protectedRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});