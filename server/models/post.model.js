import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    maxLength: 500,
    required: true
  },  
  img:{
    type:String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies:[{
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true
    },
    text:{
      type:String,
      required:true
    },
    userProfilePic:{
      type:String
    },
    username:{
      type:String
    }

  }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {
  timestamps: true
});

export const Post = mongoose.model('Post', postSchema);


