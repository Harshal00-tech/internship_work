import { validationResult } from "express-validator"
import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import ApiError from "../utils/ApiError.js"
import fs from 'fs'
import mongoose from 'mongoose'

const getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;
  const skip = (page - 1) * limit;
  // const posts = await Post.findOne({creator: req.userId})

  const posts = await Post.aggregate([
    {
      $match: { creator: new mongoose.Types.ObjectId(req.userId)} 
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
        pipeline:[{
          $project:{
            name: 1,
            email: 1,
            _id: 1
          }
        }]
      }
    },
    {
      $unwind: '$creator' 
    },
    {
      $skip: skip 
    },
    {
      $limit: limit
    }
  ]);
  if(!posts){
    throw new ApiError(500, 'internal server error while fetching post.')
  }
  res.status(200).json({ posts, message: "post fetched successfully", limit : limit, page : page})
}


const createPost = async (req, res, next) => {
  const userId = req.userId;
  const error = validationResult(req)
  if (!error.isEmpty()){
    return res.status(422).json({message: "validation Error , incorrect information inserted", error: error})
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file;

  const post =  new Post({
    title, content, creator: userId, imageUrl: imageUrl.filename
  })
  await post.save()
  const user = await User.findById(userId)
  user.posts.push(post._id)
  await user.save()
  res.status(200)
    .json({
      message: 'post created successfully',
      post
    })  
}

const getPost = async (req, res, next) => {
  const postId = req.params.postId
  const post = await Post.findOne({_id : postId, creator: req.userId})
  if(!post){
    throw new ApiError(404, 'Post Not Found')
  }
  return res.status(200).json({message: 'post fetched successfully.', post})
}


const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      throw errors
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file;
    console.log(postId, title, content, imageUrl)
    if (!postId){
      throw new Error('post not found')
    } 
    if(!title || !content || !imageUrl){
      throw new Error('post data is required.')
    }
    const post = await Post.findOneAndUpdate({_id: postId, creator: req.userId}, {title, content , imageUrl : imageUrl.filename})
    if (!post) {
      throw new ApiError(422, 'Invalid postId.')
    }
    await fs.unlinkSync('public/' + post.imageUrl)
    return res.json({message : 'post updated successfully'})
  } catch (error) {
    throw new ApiError(500, 'internal server error.', error)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    console.log(req.userId)
    const post = await Post.findOneAndDelete({_id: postId, creator: req.userId});
    const user = await User.findById(req.userId)
    user.posts.pull(postId);
    await user.save()
    await fs.unlinkSync('public/' + post.imageUrl)  
    res.status(200).json({message:'post deleted successfully'})
  } catch (error) {
    throw new ApiError(500, 'server error while deleting post.', error)
  }
}

export {getPosts, createPost, getPost, updatePost, deletePost}