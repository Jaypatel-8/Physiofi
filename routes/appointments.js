const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
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
      message: 'Invalid token.'
    });
  }
};

// Create new appointment
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      type,
      service,
      address,
      symptoms,
      medicalHistory,
      currentMedications,
      allergies
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime || !type) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date, time, and type are required'
      });
    }

    // Check if doctor exists and is available
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (doctor.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available'
      });
    }

    // Check doctor availability for the requested time
    const appointmentDateObj = new Date(appointmentDate);
    const dayName = appointmentDateObj.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!doctor.isAvailable(dayName, appointmentTime, type)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at the requested time'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.userId,
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      type,
      service,
      address,
      symptoms,
      medicalHistory,
      currentMedications,
      allergies
    });

    await appointment.save();

    // Populate the appointment with patient and doctor details
    await appointment.populate('patient', 'name email phone');
    await appointment.populate('doctor', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get appointments for a user (patient, doctor, or admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, type, startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user.userId;
    }
    // Admin can see all appointments

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get appointment by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone age gender address')
      .populate('doctor', 'name specialization email phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to view this appointment
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update appointment status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update status
    appointment.status = status;
    if (notes) {
      if (req.user.role === 'patient') {
        appointment.notes.patient = notes;
      } else if (req.user.role === 'doctor') {
        appointment.notes.doctor = notes;
      } else if (req.user.role === 'admin') {
        appointment.notes.admin = notes;
      }
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reschedule appointment
router.patch('/:id/reschedule', verifyToken, async (req, res) => {
  try {
    const { newDate, newTime, reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be rescheduled
    if (!appointment.canBeRescheduled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be rescheduled at this time'
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check doctor availability for new time
    const doctor = await Doctor.findById(appointment.doctor);
    const newDateObj = new Date(newDate);
    const dayName = newDateObj.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!doctor.isAvailable(dayName, newTime, appointment.type)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at the new time'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      appointmentDate: newDateObj,
      appointmentTime: newTime,
      status: { $in: ['Pending', 'Confirmed'] },
      _id: { $ne: appointment._id }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'New time slot is already booked'
      });
    }

    // Reschedule appointment
    await appointment.reschedule(newDate, newTime, reason, req.user.role);

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Cancel appointment
router.patch('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled at this time'
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cancel appointment
    await appointment.cancel(reason, req.user.role);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Complete appointment (doctor only)
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can complete appointments'
      });
    }

    const { notes, progress, diagnosis, treatment } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Complete appointment
    await appointment.complete(notes, progress);

    // Update diagnosis and treatment if provided
    if (diagnosis) {
      appointment.diagnosis = diagnosis;
    }
    if (treatment) {
      appointment.treatment = treatment;
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get today's appointments
router.get('/today', verifyToken, async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'doctor') {
      appointments = await Appointment.getTodaysAppointments(req.user.userId);
    } else if (req.user.role === 'patient') {
      appointments = await Appointment.getTodaysAppointments();
      appointments = appointments.filter(apt => apt.patient._id.toString() === req.user.userId);
    } else if (req.user.role === 'admin') {
      appointments = await Appointment.getTodaysAppointments();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;