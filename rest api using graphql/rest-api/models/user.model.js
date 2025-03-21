import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type:String,
    required:true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{post: {type:mongoose.Schema.Types.ObjectId, ref:'Post' }}]
}, {timestamps: true})

userSchema.methods.createToken = function(){
  return jwt.sign({
    _id: this._id
  }, 'secretsecretsecret', {expiresIn: '1d'})
}



const User = mongoose.model('User', userSchema)

export default User;