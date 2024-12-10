import { uploadImage } from '../helper/uploadImage.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import fs from 'fs'


export const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body
    const image = req.file

    if (!postedBy || !text) return res.status(400).json({
      success: false,
      message: "PostedBy and text is required"
    });

    const user = await User.findById(postedBy)
    if (!user) return res.status(400).json({
      success: false,
      message: "user not found"
    });

    if (user._id.toString() !== req.user._id.toString()) return res.status(400).json({
      success: false,
      message: "Unauthorized to create a post"
    });

    const maxLength = 500
    if (text.length > maxLength) return res.status(400).json({
      success: false,
      message: `text length must be less than ${maxLength}`
    });


     // Initialize variables for image upload
    let secure_url = "";
    let public_id = "";

    // Handle optional image upload
    if (image) {
      const uploadResult = await uploadImage(image.path);
      secure_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;
      fs.unlinkSync(image.path); // Remove the local image file after upload
    }


    const newPost = new Post({
      postedBy,
      text,
      image: secure_url,
      imageId: public_id
    })
    await newPost.save()

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      newPost
    });

  } catch (error) {
    console.error("Error in creating a Post: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
}


export const getPost=async(req,res)=>{
  try {
    const post=await Post.findById(req.params.id)
    if(!post) return res.status(400).json({
      success: false,
      message: "post not found"
    });

    res.status(201).json({
      success: true,
      message: "post found",
      post
    });

  } catch (error) {
    
    console.error("Error in creating a Post: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

    
  }
}
