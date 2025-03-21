import { Router } from "express";
import { registerUser, loginUser, getUser , logoutUser} from "../controllers/user.controllers.js";
import { body } from "express-validator";
import verifyUser from "../middleware/auth.js";

const router = Router();

router.post('/register',
  [body('name').isLength({min: 3}),body('email').trim().custom((value) => {return value.toLowerCase()}).isEmail(), body('password').isLength({$min:5})],
  registerUser
)
router.post('/login', loginUser);
router.get('/get-user', verifyUser,getUser)
router.post('/logout', verifyUser,logoutUser)


export default router 