import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const verifyUser = async (req, res, next) => {
    const bearerToken = req.cookies.token
    if(!bearerToken){
      throw new ApiError(401, 'unauthenticated.')
    }
    const token = bearerToken.split(' ')[1];
    const decodedToken = await jwt.verify(token, 'secretsecretsecret');
    if(!decodedToken){
      throw new ApiError(422, 'invalid token')
    }
    req.userId = decodedToken._id
    next()
}

export default verifyUser;