const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { loginLink } = require('graphqlock');

// users/register ---> adds a record to users table db
router.post('/register',
  userController.register,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

// users/login ---> checks the users table to see if the user exists
router.post('/login', 
  userController.verifylogin, 
  userController.setCookieANDToken, 
  loginLink,
  (req, res) => {
    return res.status(200).json(res.locals);
  }
);

// users/authenticate ---> checks the jwt cookie to see if user session is live
router.get('/authenticate', 
  userController.authenticate, 
  (req, res) => {
    return res.status(200).json(res.locals);
  }
)

// users/logout ---> removes all cookies from current user session
router.get('/logout', 
  userController.logout, 
  (req, res) => {
    return res.status(200).json({ success: true });
  }
)

// router.get('/grabUser', loginController.grabUser, (req, res) => {
//   console.log('req.cookies', res.locals.user);
//   return res.status(200).json(res.locals.user); //res.locals.user = {username: foo, userID: foo}
// });

module.exports = router;
