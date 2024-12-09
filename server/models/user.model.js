import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
     minlength: 3
}
  ,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true  
  },
  profilePic: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: "",
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

export const User=mongoose.model("User",userSchema)
