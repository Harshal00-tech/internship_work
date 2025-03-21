// const session = require('express-session')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const ROUND = 10
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const {validationResult} = require('express-validator')

const EMAIL_API = "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"
sgMail.setApiKey(EMAIL_API)


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLogin : req.session.isLogin,
    errorMessage: req.flash('error'),
    success: req.flash('success')
  }); 
};


exports.postLogin = (req, res, next) => { 
  const email = req.body.email;
  const password = req.body.password;
  const error = validationResult(req)
  if(error.array() && error.array().msg && error.array().msg != ''){
    req.flash('error', error.array().msg)
    return res.redirect('/login')
  }

  User.findOne({email})
    .then((user) => {
      if (!user){
        req.flash('error', 'It looks like you don’t have an account yet. Create one now!')
        return res.redirect('/signup')
      } 
      const matched = bcrypt.compareSync(password, user.password)  
      if (matched){
        req.session.isLogin = true;  
        req.session.user = user; 
        res.redirect('/'); 
      } else {
        req.flash('error', 'Oops! The password you entered is incorrect. Please double-check and try again.')
        res.status(401).redirect('/login')
      }
    })
    .catch(error => {
      const err = new Error(error)
      res.status(500)
      next(err) 
    })
}

exports.getLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/login');
  } catch (error) {
    const err = new Error(error)
    res.status(500)
    next(err) 
  }
}

exports.postSignup =  (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.conformPassword
  const Error = validationResult(req)
  validationError = Error.array()[0]?.msg ? (Error.array()[0]?.msg  == '' ? '' : Error.array()[0].msg) : ''
  if(!Error.isEmpty()){
    return res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign Up',
      isLogin : req.session.isLogin,
      validationError : validationError,
      errorMessage:  req.flash('error') ,
      success: req.flash('success')
    }); 
  }
  User.findOne({email})
    .then(userDoc => {
      if(userDoc){
        req.flash('error', 'User already exist! Try to different Email.')
        return res.status(200).redirect('/signup')
      }
      let hashPass = bcrypt.hashSync(password, ROUND)
      const user = new User({
        email, password:hashPass, cart: {items:[]}
      })
      user.save()
        .then(() => {
          const msg = {
            to: 'harshalpatilaz2121@gmail.com',
            from: 'harshal.patil@differenzsystem.com', // Use the email address or domain you verified above
            subject: 'Account created successfully',
            html: '<strong>Account created successfully</strong>',
          };
          sgMail
            .send(msg)
            .then(() => {}, error => {
              console.error(error);
          
              if (error.response) {
                console.error(error.response.body)
              }
            });
          req.flash('success', 'Account created successfully')
          res.status(200).redirect('/login')
        })
        .catch(err => {
          throw err
        })
    })
    .catch(error => {
      const err = new Error(error)
      res.status(500)
      next(err) 
    })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup',{
    path: '/signup',
    pageTitle : 'Signup page',
    isLogin : req.session.isLogin,
    errorMessage: req.flash('error'),
    validationError :'',
  })  
}

exports.getVarify = (req, res, next) => {
  res.render('auth/reset',{
    path: '/reset',
    pageTitle : 'Reset password',
    isLogin : req.session.isLogin,
    errorMessage: req.flash('error'),
  })  
}

exports.postVarify = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error('Error generating random bytes:', err);
      return;
    }
    const token = buffer.toString('hex');
    User.findOne({email : req.body.email})
      .then(user => {
        if(!user) {
          req.flash('error', 'Invalid Email.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 3600000
        console.log("user", user)
        console.log(user)
        User.findByIdAndUpdate(user._id, user)
          .then(() => {
            req.flash('success', 'Email has successfully sent to your email address.')
            res.redirect('/login')
            const msg = {
              to: req.body.email,
              from: 'harshal.patil@differenzsystem.com', // Use the email address or domain you verified above
              subject: 'Reset Password',
              html: `<div>
                  <h1>Password Reset Request</h1>
                  <p>Hello,</p>
                  <p>We received a request to reset your password for your account. If you did not request a password reset, please ignore this email. If you did, please click the button below to reset your password:</p>
                  <a href="http://localhost:3000/verify/${token}" class="button">Reset My Password</a>
                  <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                  <p><a href="http://localhost:3000/verify/${token}">'http://localhost:3000/verify/${token}'</a></p>
                  <p>Thank you,<br>The ecommerce Team</p>

                  <div class="footer">
                      <p>If you have any questions, feel free to contact our support team at [support@ecommerce.com].</p>
                  </div>
              </div>`,
            };
            sgMail
              .send(msg)
              .then(() => {}, error => {
                console.error(error);
                if (error.response) {
                  console.error(error.response.body)
                }
              });
            })
            .catch(err => console.log(err))
      })
      .catch((error) =>{
        const err = new Error(error)
        res.status(500)
        next(err) 
      })
  })
}


exports.getNewPassword = (req, res, next) => {
  let token = req.params.resetToken;
  User.findOne({resetToken: token, resetTokenExpiry : {$gt:  Date.now()}})
    .then((user) => {
      console.log('fetching user by reset token.', user)
      res.render('auth/new-password',{
        path: '/new-password',
        pageTitle : 'Change password',
        isLogin : req.session.isLogin,
        errorMessage: req.flash('error'),
        userId : user._id.toString()
      })  
    })
    .catch((error) => {
      const err = new Error(error)
      res.status(500)
      next(err) 
    })
}


exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const hashPass =  bcrypt.hashSync(newPassword, ROUND)
  const userId = req.body.userId
  User.findByIdAndUpdate(userId, {$set : {password : hashPass}}, {$unset : {resetToken : '', resetTokenExpiry : ''}})
    .then(() => {
      req.flash('success', 'Password Changed Successfully')
      res.redirect('/login')
    })
    .catch((error) => {
      const err = new Error(error)
      res.status(500)
      next(err) 
    })
}