const express = require('express');
const {body} = require('express-validator')
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', 
    body('email', 'Please enter valid email.').isEmail(),
    authController.postLogin
);
router.get('/logout', authController.getLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', 
  body('email').isEmail().withMessage('Please enter valid Email.'), 
  body('password', 'Password must be strong.').isLength({min: 5}).isAlphanumeric(), 
  body('confirmPassword').custom((value, {req}) => {if(value != req.body.password){throw new Error("confirm password doesn't match")} else {return true}}), 
  authController.postSignup
);

//emaile-reset password link route
router.get('/verify/:resetToken', authController.getNewPassword);
router.post('/set-password', authController.postNewPassword)

router.get('/reset', authController.getVarify);
router.post('/reset', authController.postVarify);


module.exports = router;