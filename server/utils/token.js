const jwt = require('jsonwebtoken');
require('dotenv').config();

// returns a signed jwt access token given a username and id
const generateAccessToken = (username, id, role) => {
  return jwt.sign({ id, username, role }, process.env.JWT_SECRET, { expiresIn: '1800s'});
}

module.exports = { generateAccessToken }
