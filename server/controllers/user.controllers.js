import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for empty fields
    if(!username || !email || !password){
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email"
      });
    }
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if(!userExists)
    {
      return res.status(400).json({
        success: false,
        message: "email or username already exists"
      });
    }
    // Hash password
    const hashedPassword=await bcrypt.hash(password,10)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Set cookie with token
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure:true
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
      token
    });

  } catch (error) {
    console.error("Error in registerUser: ", error.message);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}; 