const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const PatientTreatmentPlan = require('../models/PatientTreatmentPlan');
const { isPatient, isAdmin, isAuthenticated } = require('../middleware/rbac');
const router = express.Router();

// Get patient profile
router.get('/profile', isPatient, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.userId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update patient profile
router.put('/profile', isPatient, async (req, res) => {
  try {

    const {
      name,
      full_name,
      email,
      phone,
      age,
      gender,
      address,
      emergencyContact,
      emergency_contact,
      medicalHistory,
      medical_history,
      currentConditions,
      current_conditions,
      preferences
    } = req.body;

    const patient = await Patient.findById(req.user.userId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update fields - support both old and new field names
    if (name || full_name) {
      const patientName = name || full_name;
      patient.name = patientName;
      patient.full_name = patientName;
    }
    if (email) {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      patient.email = email.toLowerCase().trim();
    }
    if (phone) {
      // Validate phone format
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be 10 digits'
        });
      }
      patient.phone = cleanPhone;
    }
    if (age !== undefined) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        return res.status(400).json({
          success: false,
          message: 'Age must be a valid number between 0 and 120'
        });
      }
      patient.age = ageNum;
    }
    if (gender) {
      const validGenders = ['Male', 'Female', 'Other'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: `Gender must be one of: ${validGenders.join(', ')}`
        });
      }
      patient.gender = gender;
    }
    if (address) patient.address = address;
    if (emergencyContact || emergency_contact) {
      patient.emergency_contact = emergencyContact || emergency_contact;
    }
    if (medicalHistory || medical_history) {
      patient.medical_history = medicalHistory || medical_history;
    }
    if (currentConditions || current_conditions) {
      patient.current_conditions = currentConditions || current_conditions;
    }
    if (preferences) patient.preferences = preferences;

    await patient.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient appointments
router.get('/appointments', isPatient, async (req, res) => {
  try {

    const { status, type, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { patient: req.user.userId };
    if (status) query.status = status;
    if (type) query.type = type;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance - returns plain JavaScript objects

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient stats
router.get('/stats', isPatient, async (req, res) => {
  try {

    const patientId = req.user.userId;

    const stats = await Appointment.aggregate([
      { $match: { patient: new mongoose.Types.ObjectId(patientId) } },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          pendingAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          confirmedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          averageRating: { $avg: '$rating.patient.rating' }
        }
      }
    ]);

    const patient = await Patient.findById(patientId);
    
    // Calculate upcoming appointments
    const now = new Date();
    const upcomingCount = await Appointment.countDocuments({
      patient: req.user.userId,
      status: { $in: ['Pending', 'Confirmed', 'Scheduled'] },
      appointmentDate: { $gte: now }
    });

    // Get active treatment plans count (appointments with treatment plans)
    const activeTreatments = await Appointment.countDocuments({
      patient: req.user.userId,
      status: { $in: ['Confirmed', 'In Progress'] },
      'treatment.plan': { $exists: true, $ne: '' }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalAppointments: stats[0]?.totalAppointments || 0,
          upcomingAppointments: upcomingCount,
          completedAppointments: stats[0]?.completedAppointments || 0,
          activeTreatments: activeTreatments,
          recoveryProgress: patient?.recoveryProgress || 0,
          averageRating: stats[0]?.averageRating || 0
        }
      }
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update recovery progress
router.patch('/progress', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const patient = await Patient.findById(req.user.userId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.updateProgress(progress);

    res.json({
      success: true,
      message: 'Recovery progress updated successfully',
      data: { recoveryProgress: patient.recoveryProgress }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all patients (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {

    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .select('-otp -password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient by ID (admin/doctor only)
router.get('/:id', isPatient, async (req, res) => {
  try {
    // Patients can only see their own profile
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const patient = await Patient.findById(req.params.id)
      .select('-otp -password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update patient status (admin only)
router.patch('/:id/status', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    patient.status = status;
    await patient.save();

    res.json({
      success: true,
      message: 'Patient status updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Update patient status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete patient (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if patient has any appointments
    const appointments = await Appointment.find({ patient: req.params.id });
    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete patient with existing appointments'
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient treatment plans
router.get('/treatment-plans', isPatient, async (req, res) => {
  try {
    // Debug logging
    console.log('Treatment plans request - User:', req.user?.role, 'UserId:', req.user?.userId);
    
    const { status } = req.query;
    let query = { patient: req.user.userId };
    if (status) query.status = status;

    const treatmentPlans = await PatientTreatmentPlan.find(query)
      .populate('doctor', 'name specialization email phone')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: { treatmentPlans: treatmentPlans || [] }
    });
  } catch (error) {
    console.error('Get patient treatment plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get treatment plan by ID
router.get('/treatment-plans/:id', isPatient, async (req, res) => {
  try {

    const treatmentPlan = await PatientTreatmentPlan.findOne({
      _id: req.params.id,
      patient: req.user.userId
    })
    .populate('doctor', 'name specialization email phone')
    .populate('patient', 'name email phone')
    .lean();

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: 'Treatment plan not found'
      });
    }

    res.json({
      success: true,
      data: treatmentPlan
    });
  } catch (error) {
    console.error('Get treatment plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add patient note to treatment plan
router.post('/treatment-plans/:id/notes', isPatient, async (req, res) => {
  try {

    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const treatmentPlan = await PatientTreatmentPlan.findOne({
      _id: req.params.id,
      patient: req.user.userId
    });

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: 'Treatment plan not found'
      });
    }

    treatmentPlan.notes.push({
      note,
      addedBy: 'patient',
      addedAt: new Date()
    });

    await treatmentPlan.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: treatmentPlan
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;