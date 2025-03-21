import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const verifyUser = async (req, res, next) => {
  try {
    const token = req.get('Authorization')
    if(!token){
      next()
    }
    const decodedToken = await jwt.verify(token, 'secretsecretsecret');
    req.userId = decodedToken._id
    next()
  } catch (error) {
    throw new ApiError(401, 'Unauthorized user', error)
  }
}

export default verifyUser;