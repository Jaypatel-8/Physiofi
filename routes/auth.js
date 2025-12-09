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
    const { full_name, name, email, phone, password, age, gender, address, emergency_contact, medical_history, current_conditions } = req.body;

    // Support both full_name and name for backward compatibility
    const patientName = full_name || name;

    // Validation
    if (!patientName || !email || !phone || !password || !age || !gender) {
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

    // Create new patient - support both old and new field names
    // Ensure full_name is always set (required field)
    if (!patientName || patientName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Full name is required. Please provide either full_name or name field.'
      });
    }
    
    const patientData = {
      full_name: patientName.trim(),
      name: patientName.trim(), // For backward compatibility
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password, // Will be hashed to password_hash in pre-save hook
      age: parseInt(age),
      gender,
      status: 'Active' // Explicitly set status to Active for new registrations
    };

    // Add optional fields
    if (address) {
      // If address is string, store as is; if object, convert to string
      if (typeof address === 'string') {
        patientData.address = address.trim();
      } else if (typeof address === 'object' && address !== null) {
        // Convert address object to string format
        const addressParts = [];
        if (address.street && address.street.trim()) addressParts.push(address.street.trim());
        if (address.city && address.city.trim()) addressParts.push(address.city.trim());
        if (address.state && address.state.trim()) addressParts.push(address.state.trim());
        if (address.pincode && address.pincode.trim()) addressParts.push(address.pincode.trim());
        if (address.country && address.country.trim()) addressParts.push(address.country.trim());
        const addressString = addressParts.join(', ').trim();
        patientData.address = addressString || undefined; // Only set if not empty
      }
    }
    if (emergency_contact) patientData.emergency_contact = emergency_contact;
    if (medical_history) patientData.medical_history = typeof medical_history === 'string' ? medical_history : JSON.stringify(medical_history);
    if (current_conditions) patientData.current_conditions = typeof current_conditions === 'string' ? current_conditions : JSON.stringify(current_conditions);

    const patient = new Patient(patientData);
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
          name: patient.full_name || patient.name,
          email: patient.email,
          phone: patient.phone,
          role: 'patient'
        }
      }
    });
  } catch (error) {
    console.error('❌ Patient registration error:', error);
    console.error('📍 Error Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack
      })
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

    // Case-insensitive email lookup
    const patient = await Patient.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    if (!patient) {
      console.log('Patient not found for email:', email);
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Handle patients without status field (legacy records)
    // Default to 'Active' if status is not set and update the record
    if (!patient.status) {
      patient.status = 'Active';
    }
    
    const patientStatus = patient.status;
    if (patientStatus !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Verify password
    // Check if password_hash exists
    if (!patient.password_hash && !patient.password) {
      console.error('Patient has no password_hash or password:', patient._id);
      return res.status(400).json({
        success: false,
        message: 'Account setup incomplete. Please reset your password.'
      });
    }
    
    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Password validation failed for patient:', patient._id, 'Has password_hash:', !!patient.password_hash);
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login and ensure status is set
    patient.lastLogin = new Date();
    if (!patient.status) {
      patient.status = 'Active';
    }
    // Ensure password_hash exists before saving
    if (!patient.password_hash && patient.password) {
      // This should have been set in pre-save hook, but handle edge case
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      patient.password_hash = await bcrypt.hash(patient.password, salt);
      patient.password = undefined;
    }
    try {
      await patient.save();
    } catch (saveError) {
      console.error('Error saving patient:', saveError);
      // If save fails, still allow login but log the error
    }

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        patient: {
          id: patient._id,
          name: patient.full_name || patient.name,
          email: patient.email,
          phone: patient.phone,
          role: 'patient'
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
      full_name,
      name,
      email,
      phone,
      password,
      specialization,
      license_no,
      license,
      qualifications,
      experience_years,
      experience,
      clinic_address,
      consultation_fees,
      availability_schedule,
      occupation,
      address,
      bio
    } = req.body;

    // Support both full_name and name for backward compatibility
    const doctorName = full_name || name;
    const doctorLicense = license_no || license;
    const doctorExperience = experience_years || experience;

    // Validation
    if (!doctorName || !email || !phone || !password || !specialization || !doctorLicense) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate specialization enum
    const validSpecializations = ['Ortho', 'Neuro', 'Pedia', 'Sports', 'General'];
    if (!validSpecializations.includes(specialization)) {
      return res.status(400).json({
        success: false,
        message: `Specialization must be one of: ${validSpecializations.join(', ')}`
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { license_no: doctorLicense }, { license: doctorLicense }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists with this email or license'
      });
    }

    // Create new doctor - support both old and new field names
    const doctorData = {
      full_name: doctorName,
      name: doctorName, // For backward compatibility
      email,
      phone,
      password, // Will be hashed to password_hash in pre-save hook
      specialization,
      license_no: doctorLicense,
      license: doctorLicense, // For backward compatibility
      experience_years: doctorExperience || 0,
      experience: doctorExperience || 0, // For backward compatibility
      consultation_fees: consultation_fees || 0,
      status: 'Inactive', // New doctors need admin approval - set to Inactive initially
      isVerified: false // Doctors need verification
    };

    // Add optional fields
    if (qualifications) {
      doctorData.qualifications = typeof qualifications === 'string' 
        ? qualifications 
        : JSON.stringify(qualifications);
    }
    if (clinic_address) {
      doctorData.clinic_address = clinic_address;
    } else if (address) {
      // If address is object, convert to string
      doctorData.clinic_address = typeof address === 'string' 
        ? address 
        : `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '');
    }
    if (availability_schedule) {
      doctorData.availability_schedule = typeof availability_schedule === 'object' 
        ? availability_schedule 
        : JSON.parse(availability_schedule);
    }
    if (occupation) doctorData.occupation = occupation;
    if (bio) doctorData.bio = bio;

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully. Awaiting admin approval.',
      data: {
        doctorId: doctor._id,
        name: doctor.full_name || doctor.name,
        specialization: doctor.specialization,
        role: 'doctor'
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
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

    // Case-insensitive email lookup
    const doctor = await Doctor.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    if (!doctor) {
      console.log('Doctor not found for email:', email);
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Handle doctors without status field (legacy records)
    // Default to 'Active' if status is not set
    const doctorStatus = doctor.status || 'Active';
    if (doctorStatus !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Account is inactive or pending approval'
      });
    }

    // Verify password
    // Check if password_hash exists
    if (!doctor.password_hash && !doctor.password) {
      console.error('Doctor has no password_hash or password:', doctor._id);
      return res.status(400).json({
        success: false,
        message: 'Account setup incomplete. Please reset your password.'
      });
    }
    
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Password validation failed for doctor:', doctor._id, 'Has password_hash:', !!doctor.password_hash);
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
          name: doctor.full_name || doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          role: 'doctor'
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

    // Case-insensitive email lookup
    const admin = await Admin.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Handle admins without status field (legacy records)
    // Default to 'Active' if status is not set
    const adminStatus = admin.status || 'Active';
    if (adminStatus !== 'Active') {
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
          name: admin.full_name || admin.name,
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

// Get current user (protected route)
// Middleware to verify JWT token (inline for this route)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

router.get('/me', verifyToken, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'patient') {
      user = await Patient.findById(req.user.userId).select('-password_hash -password -resetPasswordToken -resetPasswordExpires');
    } else if (req.user.role === 'doctor') {
      user = await Doctor.findById(req.user.userId).select('-password_hash -password -resetPasswordToken -resetPasswordExpires');
    } else if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.userId).select('-password_hash -password -resetPasswordToken -resetPasswordExpires');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure role is included in response
    const userData = user.toObject ? user.toObject() : user;
    userData.role = req.user.role; // Ensure role from token is included

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
