const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ============================================================
 * ✅ Authenticate Token Middleware
 * ------------------------------------------------------------
 * This verifies JWT tokens for protected routes.
 * It ensures:
 *  - Token is present in Authorization header.
 *  - Token is valid and not expired.
 *  - User exists and is active.
 * ============================================================
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // ✅ Fetch user from DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
    }

    // ✅ Optional check (if you have user.isActive flag)
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // ✅ Attach user to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    // ✅ Handle common token errors clearly
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

/**
 * ============================================================
 * ✅ Generate JWT Token Helper
 * ------------------------------------------------------------
 * Generates a signed JWT for a given user ID.
 * ============================================================
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d', // 7 days by default
    }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
};
