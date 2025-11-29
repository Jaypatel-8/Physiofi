const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const OTPService = require('../services/otpService');
const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Send OTP using the OTP Service
const sendOTP = async (phone, email, otp, name = 'User') => {
  // Check if we're in development mode (no Twilio/Email configured)
  const isDevMode = !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_account_sid';
  
  if (isDevMode) {
    return await OTPService.sendOTPDev(phone, email, otp, name);
  } else {
    return await OTPService.sendOTP(phone, email, otp, name);
  }
};

// Patient Registration
router.post('/patient/register', async (req, res) => {
  try {
    const { name, email, phone, age, gender, address } = req.body;

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
      age,
      gender,
      address
    });

    // Generate OTP
    const otp = patient.generateOTP();
    await patient.save();

    // Send OTP
    await sendOTP(phone, email, otp, name);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully. OTP sent to your phone.',
      data: {
        patientId: patient._id,
        phone: patient.phone
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

// Patient OTP Verification
router.post('/patient/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const isValidOTP = patient.verifyOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark as verified
    patient.isVerified = true;
    patient.otp = undefined;
    await patient.save();

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.json({
      success: true,
      message: 'OTP verified successfully',
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
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Patient Login
router.post('/patient/login', async (req, res) => {
  try {
    const { phone } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (patient.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Generate OTP
    const otp = patient.generateOTP();
    await patient.save();

    // Send OTP
    await sendOTP(phone, email, otp, name);

    res.json({
      success: true,
      message: 'OTP sent to your phone',
      data: {
        patientId: patient._id,
        phone: patient.phone
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

// Doctor Registration
router.post('/doctor/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualifications,
      experience,
      license,
      address,
      bio
    } = req.body;

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
      specialization,
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

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (doctor.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive or pending approval'
      });
    }

    // In a real application, you would verify the password here
    // For now, we'll just check if password is provided
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

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

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
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

    // In a real application, you would verify the password here
    // For now, we'll just check if password is provided
    if (!password) {
      await admin.incLoginAttempts();
      return res.status(400).json({
        success: false,
        message: 'Password is required'
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

// Resend OTP
router.post('/patient/resend-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Generate new OTP
    const otp = patient.generateOTP();
    await patient.save();

    // Send OTP
    await sendOTP(phone, patient.email, otp, patient.name);

    res.json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (optional - for token blacklisting)
router.post('/logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;