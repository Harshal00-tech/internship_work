import { Router } from "express";
import { getPost, createPost, getPosts, updatePost, deletePost } from "../controllers/post.controllers.js";
import {body} from 'express-validator'
import verifyUser from "../middleware/auth.js";

const router = Router()

router.get('/get-posts', verifyUser, getPosts)
router.post('/create-post', verifyUser, body('title').isLength({min: 7}), body('content').isLength({min:5}),  createPost)
router.get('/get-post/:postId', verifyUser, getPost)
router.patch('/update-post/:postId', verifyUser,body('title').isLength({min: 7}), body('content').isLength({min:5}), updatePost)
router.delete('/delete-post/:postId', verifyUser, deletePost)



export default router;