const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Get user by role and ID
const getUserByRole = async (role, id) => {
  let User;
  switch (role) {
    case 'patient':
      User = Patient;
      break;
    case 'doctor':
      User = Doctor;
      break;
    case 'admin':
      User = Admin;
      break;
    default:
      throw new Error('Invalid user role');
  }
  
  const user = await User.findById(id).select('-password -otp');
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }
  
  return user;
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user based on role
    const user = await getUserByRole(decoded.role, decoded.id);
    
    // Add user to request object
    req.user = user;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token or user not found',
      error: error.message
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user role found.'
      });
    }
    
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Permission-based authorization middleware
const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }
    
    if (req.userRole === 'admin' && !req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await getUserByRole(decoded.role, decoded.id);
      req.user = user;
      req.userRole = decoded.role;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  authorizePermission,
  optionalAuth
};

