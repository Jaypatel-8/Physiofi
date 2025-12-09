const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

/**
 * Role-Based Access Control Middleware
 * Ensures users can only access routes for their role
 */
const rbac = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;

      // Check if user role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        // Determine correct redirect path
        let redirectPath = '/login';
        if (decoded.role === 'patient') {
          redirectPath = '/patient/dashboard';
        } else if (decoded.role === 'doctor') {
          redirectPath = '/doctor/dashboard';
        } else if (decoded.role === 'admin') {
          redirectPath = '/admin/dashboard';
        }

        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          redirectPath
        });
      }

      // Verify user still exists in database
      let user;
      if (decoded.role === 'patient') {
        user = await Patient.findById(decoded.userId).select('-password -password_hash');
      } else if (decoded.role === 'doctor') {
        user = await Doctor.findById(decoded.userId).select('-password -password_hash');
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.userId).select('-password -password_hash');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        });
      }

      // Attach user object to request
      req.userData = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      console.error('❌ RBAC Middleware Error:', error);
      console.error('📍 Error Stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          stack: error.stack
        })
      });
    }
  };
};

/**
 * Middleware to check if user is patient
 */
const isPatient = rbac(['patient']);

/**
 * Middleware to check if user is doctor
 */
const isDoctor = rbac(['doctor']);

/**
 * Middleware to check if user is admin
 */
const isAdmin = rbac(['admin']);

/**
 * Middleware to check if user is admin or doctor
 */
const isAdminOrDoctor = rbac(['admin', 'doctor']);

/**
 * Middleware to check if user is any authenticated user
 */
const isAuthenticated = rbac(['patient', 'doctor', 'admin']);

module.exports = {
  rbac,
  isPatient,
  isDoctor,
  isAdmin,
  isAdminOrDoctor,
  isAuthenticated
};



