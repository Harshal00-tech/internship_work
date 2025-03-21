import mongoose from 'mongoose';
import User from './user.model.js';

const loginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginAt: [ {type: Date, default: () => new Date() } ],
  token: {
    type: String,
    required: true,   
    unique: true
  },
  isDeleted: {
    type: Boolean,
    default: false 
  },
  expireAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });


loginSchema.methods.updateLogin = async function (token){
  this.token = token;
  this.expireAt =  new Date(Date.now() + 24 * 60 * 60 * 1000); 
  this.loginAt.push(Date.now())
  await this.save()
}
const Login = mongoose.model('Login', loginSchema);

export default Login;
