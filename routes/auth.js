const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Patient Registration
router.post('/patient/register', async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, address } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient already exists with this email or phone'
      });
    }

    // Create new patient
    const patient = new Patient({
      name,
      email,
      phone,
      password,
      age,
      gender,
      address
    });

    await patient.save();

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        token,
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone
        }
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Patient Login
router.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (patient.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    patient.lastLogin = new Date();
    await patient.save();

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone
        }
      }
    });
  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Patient Forgot Password
router.post('/patient/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    patient.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    patient.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await patient.save();

    // In production, send email with reset link
    // For now, return token in development
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&type=patient`;

    console.log('Password Reset Link:', resetUrl);
    console.log('Reset Token:', resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      // Only in development
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Patient Reset Password
router.post('/patient/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    // Hash token to compare
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const patient = await Patient.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    patient.password = password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpires = undefined;
    await patient.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Doctor Registration
router.post('/doctor/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      occupation,
      qualifications,
      experience,
      license,
      address,
      bio
    } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !specialization || !license) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { license }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists with this email or license'
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      name,
      email,
      phone,
      password,
      specialization,
      occupation,
      qualifications,
      experience,
      license,
      address,
      bio
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully. Awaiting admin approval.',
      data: {
        doctorId: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Doctor Login
router.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (doctor.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive or pending approval'
      });
    }

    // Verify password
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last active
    doctor.lastActive = new Date();
    await doctor.save();

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization
        }
      }
    });
  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Doctor Forgot Password
router.post('/doctor/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    doctor.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    doctor.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await doctor.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&type=doctor`;

    console.log('Password Reset Link:', resetUrl);
    console.log('Reset Token:', resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Doctor Reset Password
router.post('/doctor/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const doctor = await Doctor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    doctor.password = password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpires = undefined;
    await doctor.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      await Admin.findOneAndUpdate({ email }, { $inc: { loginAttempts: 1 } });
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (admin.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(400).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin Forgot Password
router.post('/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&type=admin`;

    console.log('Password Reset Link:', resetUrl);
    console.log('Reset Token:', resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin Reset Password
router.post('/admin/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
