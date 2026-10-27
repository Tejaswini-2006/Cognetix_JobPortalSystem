const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT Bearer token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: No token provided',
        });
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'careerconnect_dev_secret_key_987654321_jwt'
      );

      // Fetch user from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found or has been removed',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Contact an administrator.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Authorization header missing',
    });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}]. Current role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
