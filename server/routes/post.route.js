import express from 'express'
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost } from '../controllers/post.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { upload } from '../middleware/multer.js'


const postRouter=express.Router()

postRouter.post("/create",protectRoute,upload.single("image"),createPost)
postRouter.get("/:id",protectRoute,getPost)
postRouter.delete("/:id",protectRoute,deletePost)
postRouter.post("/like/:id",protectRoute,likeUnlikePost)
postRouter.post("/reply/:id",protectRoute,replyToPost)
postRouter.get("/feed",protectRoute,getFeedPosts)

export default postRouter