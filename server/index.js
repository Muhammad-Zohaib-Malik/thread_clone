import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())



app.use('/api/v1/users', userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

