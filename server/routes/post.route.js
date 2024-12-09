import express from 'express'
import { createPost, deletePost, getPost } from '../controllers/post.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { upload } from '../middleware/multer.js'


const postRouter=express.Router()

postRouter.post("/create",protectRoute,upload.single("image"),createPost)
postRouter.get("/:id",protectRoute,getPost)
postRouter.delete("/:id",protectRoute,deletePost)



export default postRouter