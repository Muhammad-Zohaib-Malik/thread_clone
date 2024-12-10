import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

export const protectRoute=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt
    if(!token)
    {
     return  res.status(500).json({
      success: false,
      message: "Unauthorized"
    });
    }

  const decoded=jwt.verify(token,process.env.JWT_SECRET)
  const user=await User.findById(decoded.userId).select("-password")
  req.user=user
  next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}