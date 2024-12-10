import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../helper/generateTokenAndSetCookie.js';

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check for empty fields
    if (!name || !username || !email || !password) {
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
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "email or username already exists"
      });
    }
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();


    generateTokenAndSetCookie(newUser._id, res)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
    });

  } catch (error) {
    console.error("Error in registerUser: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username })

    if (!user.password) {
      console.log("Password field is missing for user:", username);
      return res.status(400).json({
        success: false,
        message: "Invalid user credentials"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")


    if (!user || !isPasswordCorrect) return res.status(400).json({
      success: false,
      message: "Invalid user or password"
    });

    generateTokenAndSetCookie(user._id, res)

    res.status(201).json({
      success: true,
      message: "User login successfully",
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });

  } catch (error) {
    console.error("Error in loginUser: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

}

export const logoutUser = async (_, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 })
    res.status(201).json({
      success: true,
      message: "User Logout Successfully"
    });

  } catch (error) {
    console.error("Error in logoutUser: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
}

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)
    console.log(req.user._id)


    if (!userToModify || !currentUser) return res.status(400).json({
      success: false,
      message: "User not found"
    });

    if (id === req.user._id.toString()) return res.status(400).json({
      success: false,
      message: "You can't follow/unfollow yourself"
    });

    const isFollowing = currentUser.followings.includes(id)
    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } })
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
      res.status(201).json({
        success: true,
        message: "User unfollowed Successfully"
      });
    }
    else {
      //follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } })
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
      res.status(201).json({
        success: true,
        message: "User followed Successfully"
      });
    }
  }
  catch (error) {

    console.error("Error in followed: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

}

export const updateUser = async (req, res) => {
  const { name, email, username, password, profilePic, bio } = req.body
  const userId = req.user._id
  try {
    let user = await User.findById(userId)
    if (!user) return  res.status(400).json({
      success: false,
      message: "user not found"
    });
   
    if(req.params.id!==userId.toString()) return res.status(400).json({
      success: false,
      message: "You can't update other user profile"
    });

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    user.name = name || user.name
    user.email = email || user.email
    user.username = username || user.username
    user.profilePic = profilePic || user.profilePic
    user.bio = bio || user.bio

    user = await user.save()

    res.status(201).json({
      success: true,
      message: "Profile Updated Successfully",
      user
    });


  } catch (error) {
    console.error("Error in UpdatingUser: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
