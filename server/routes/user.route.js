import express from 'express'
import { followUnFollowUser, freezeUser, getUserProfile, loginUser, logoutUser, registerUser, updateUser } from '../controllers/user.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'


const userRouter=express.Router()

userRouter.get("/profile/:username",protectRoute,getUserProfile)
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)
userRouter.post("/follow/:id",protectRoute,followUnFollowUser)
userRouter.put("/update/:id",protectRoute,updateUser)
userRouter.put("/freeze",protectRoute,freezeUser)


export default userRouter