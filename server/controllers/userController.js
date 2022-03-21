const db = require('../model.js');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/token');
const jwt = require('jsonwebtoken');

const userController = {};

userController.verifylogin = (req, res, next) => {
  const { username, password } = req.body; 
  const query = `
    SELECT * FROM users 
    WHERE username = $1 LIMIT 1;
  `;

  db.query(query, [username], (err, data) => {
    if (err) { 
      return next({
        log: `userController.verifyLogin query ERROR: ${err}`,
        message: { err: 'Error occurred in userController.register bcrypt hash. Check server logs for more details.' },
      })
    } 
    if (data.rows.length != 1) {
      res.locals.isAuthenticated = false;
      return next();
    }
    bcrypt.compare(password, (data.rows[0] || {}).password, (err, result) => {
      if (err) return next({
        log: `userController.verifyLogin bcrypt compare ERROR: ${err}`,
        message: { err: 'Error occurred in userController.register bcrypt hash. Check server logs for more details.' },
      });
      if (result === true) {
        res.locals.username = username;
        res.locals.userId = data.rows[0].id;
        res.locals.role = data.rows[0].role;
        res.locals.isAuthenticated = true;
      } else {
        res.locals.isAuthenticated = false;
      }
      return next();
    })
  })
}

userController.authenticate = (req, res, next) => {
  res.locals.isAuthenticated = false;
  if (!req.cookies.jwt) {
    return next();
  }
  // console.log(req.cookies);
  jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next({
      log: `userController.authenticate ERROR: ${err}`,
      message: { err: 'Error occurred in userController.authenticate. Check server logs for more details.' },
    });
    decoded ? res.locals.isAuthenticated = true : res.locals.isAuthenticated = false;
    return next();
  })
}

userController.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.clearCookie('username');
  res.clearCookie('user_id');
  res.clearCookie('accessToken');
  return next();
}

userController.setCookieANDToken = (req, res, next) => {
  if (res.locals.isAuthenticated && res.locals.username) {
    const cookieAttributes = { httpOnly: true, secure: true };
    res.locals.token = generateAccessToken(res.locals.username, res.locals.userId, res.locals.role);
    res.cookie('jwt', res.locals.token, cookieAttributes);
    res.cookie('user_id', res.locals.userId, cookieAttributes);
    res.cookie('username', res.locals.username, cookieAttributes);
  }
  return next();
}

userController.register = (req, res, next) => {
    const { username, password, role } = req.body;
    const defaultSignup = {
      validSignup: false, 
      username: undefined, 
      userID: undefined
    }
    //check if password and/or username are empty string
    if (!username.length || !password.length) {
        res.locals.user = defaultSignup;
        return next()
    } else {
      const countQuery = `
        SELECT COUNT (*) FROM users
        WHERE username = $1;
      `;
      db.query(countQuery, [username], (err, data) => {
        if (err) return next({
          log: `userController.register query ERROR: ${err}`,
          message: { err: 'Error occurred in userController.register. Check server logs for more details.' },
        });
        // if user already exists in database exit to next middleware
        if (data.rows[0].count != '0') {
          defaultSignup.exists = true;
          res.locals.user = defaultSignup;
          return next()
        } else {
          // if user does not exist in database, add user with bcrypt password
          const saltRounds = 10;
          bcrypt.hash(password, saltRounds, (hashError, hash) => {
            if (hashError) return next({
              log: `userController.register bcrypt hash ERROR: ${hashError}`,
              message: { err: 'Error occurred in userController.register bcrypt hash. Check server logs for more details.' },
            });
            const insertQuery = `
              INSERT INTO users (username, password, role)
              VALUES ($1, $2, $3) RETURNING (id);
            `;
            const params = [username, hash, role];
            db.query(insertQuery, params, (queryError, queryResponse) => {
              if (queryError) return next({
                log: `userController.register insert user ERROR: ${queryError}`,
                message: { err: 'Error occurred in userController.register insert user. Check server logs for more details.' },
              });
              else {
                // console.log("successful account creation: return the following userID:", queryResponse.rows[0].id)
                defaultSignup.validSignup = true; 
                defaultSignup.username = username;
                defaultSignup.userID = Number(queryResponse.rows[0].id);
                res.locals.user = defaultSignup;
                return next();
              }
            });
          });
        }
      });
    }
}

module.exports = userController;
