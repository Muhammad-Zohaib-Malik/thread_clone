import express from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controllers.js'


const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)




export default userRouter