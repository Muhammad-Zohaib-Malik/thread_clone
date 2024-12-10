import express from 'express'
import { followUnFollowUser, loginUser, logoutUser, registerUser } from '../controllers/user.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'


const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)
userRouter.post("/follow/:id",protectRoute,followUnFollowUser)





export default userRouter