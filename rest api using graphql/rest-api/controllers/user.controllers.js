import { check, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcryptjs'
import User from "../models/user.model.js";


const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      throw errors.array()[0]
    }
    const {name, email, password} = req.body;
    if(!name || !email || !password){
      throw new ApiError(404, 'user data not found.')
    }
    const existedEmail = await User.findOne({email})
    if(existedEmail){
      throw new ApiError(422, 'user already exist.')
    }
    const hashedPass = bcrypt.hashSync(password, 12)
    if (!hashedPass){
      throw new ApiError(500, 'error while encrypting password.')
    }
    const user = await User.create({name, email,password : hashedPass})
    if(!user){
      throw new ApiError(500, "server error while creating user.")
    }
    return res.status(200).json({message: "user created successfully.", user})
  } catch (error) {
    throw new ApiError(500, 'server Error while registering user', error)
  }
}

const loginUser = async  (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user) {
      throw new ApiError(404, 'User not Found.')
    }
    const checkedPass = await bcrypt.compare(password, user.password);
    if(!checkedPass){
      throw new ApiError(422, 'invalid password');
    }
    const token = await user.createToken()
    res.cookie('token','Bearer '+ token, {htttOnly: true, secure: true})
    return res.status(200).json({message : 'user login successfully', token})
  } catch (error) {
    throw new ApiError(500, 'server error while login.', error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('-password');
    return res.status(200).json({message: 'user fetched successfully', user})
  } catch (error) {
    throw new ApiError(401, 'unauthorized.')
  }
}

const logoutUser = async (req, res, next) => {
  res.clearCookie('token')
  return res.status(200).json({message: "user logout successfully."})
}


export {registerUser, loginUser, getUser,logoutUser }