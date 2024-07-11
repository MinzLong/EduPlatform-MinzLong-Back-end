const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function(req, res, next) {
  let token;

  // Check for token in 'x-auth-token' header
  if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  } 
  // Check for token in 'Authorization' header
  else if (req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'secret'); // Ensure the secret matches the one used during token creation
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
