const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token's payload and attach to request object
      // We exclude the password when fetching the user data
      req.user = await User.findById(decoded.user.id).select('-password');

      // 4. Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};