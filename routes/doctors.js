const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
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

// Get all doctors (public route for booking)
router.get('/', async (req, res) => {
  try {
    const { status = 'Active', limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const doctors = await Doctor.find(query)
      .select('name email phone specialization experience license address')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update doctor profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      name,
      specialization,
      qualifications,
      experience,
      address,
      bio,
      availability,
      services
    } = req.body;

    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update fields
    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (address) doctor.address = address;
    if (bio) doctor.bio = bio;
    if (availability) doctor.availability = availability;
    if (services) doctor.services = services;

    await doctor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor appointments
router.get('/appointments', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, type, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { doctor: req.user.userId };
    if (status) query.status = status;
    if (type) query.type = type;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone age gender')
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
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;

    const stats = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
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
          averageRating: { $avg: '$rating.doctor.rating' }
        }
      }
    ]);

    const doctor = await Doctor.findById(doctorId);
    
    res.json({
      success: true,
      data: {
        totalAppointments: stats[0]?.totalAppointments || 0,
        completedSessions: stats[0]?.completedAppointments || 0,
        pendingAppointments: stats[0]?.pendingAppointments || 0,
        confirmedAppointments: stats[0]?.confirmedAppointments || 0,
        totalPatients: doctor?.totalPatients || 0,
        activePatients: doctor?.totalPatients || 0,
        todayAppointments: 0, // Will be calculated separately
        totalSessions: doctor?.totalSessions || 0,
        averageRating: doctor?.rating?.average || stats[0]?.averageRating || 0,
        rating: doctor?.rating || { average: 0, count: 0 }
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all patients for doctor
router.get('/patients', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Get all unique patient IDs from appointments
    const appointments = await Appointment.find({ doctor: doctorId })
      .select('patient')
      .populate('patient', 'name email phone age gender address profileImage')
      .lean();

    const patientMap = new Map();
    appointments.forEach(apt => {
      if (apt.patient && apt.patient._id) {
        const patientId = apt.patient._id.toString();
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            ...apt.patient,
            appointmentCount: 0,
            lastAppointment: null
          });
        }
        const patient = patientMap.get(patientId);
        patient.appointmentCount += 1;
      }
    });

    let patients = Array.from(patientMap.values());

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      patients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.phone?.includes(search)
      );
    }

    // Get appointment details for each patient
    for (let patient of patients) {
      const lastApt = await Appointment.findOne({ 
        doctor: doctorId, 
        patient: patient._id 
      })
      .sort({ appointmentDate: -1 })
      .select('appointmentDate appointmentTime status type')
      .lean();
      
      if (lastApt) {
        patient.lastAppointment = lastApt;
      }
    }

    const total = patients.length;
    const paginatedPatients = patients.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        patients: paginatedPatients,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient details with full history
router.get('/patients/:patientId', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const Patient = require('../models/Patient');
    const doctorId = req.user.userId;
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get all appointments with this patient
    const appointments = await Appointment.find({
      doctor: doctorId,
      patient: patientId
    })
    .sort({ appointmentDate: -1 })
    .populate('patient', 'name email phone age gender address')
    .lean();

    res.json({
      success: true,
      data: {
        patient,
        appointments,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'Completed').length
      }
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update doctor availability
router.patch('/availability', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { availability } = req.body; // Full availability object or { day, slots }

    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (availability.day && availability.slots) {
      // Update single day
      doctor.availability[availability.day] = availability.slots;
    } else if (typeof availability === 'object') {
      // Update full availability
      doctor.availability = { ...doctor.availability, ...availability };
    }

    await doctor.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: doctor.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get analytics for doctor
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;
    const { period = 'month' } = req.query; // month, week, year

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Appointment statistics
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            type: '$type'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily appointments for the period
    const dailyAppointments = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue (if service price exists)
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$service.price' },
          averageRevenue: { $avg: '$service.price' }
        }
      }
    ]);

    // Patient growth
    const patientGrowth = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$appointmentDate' }
          },
          newPatients: { $addToSet: '$patient' }
        }
      },
      {
        $project: {
          month: '$_id',
          newPatientsCount: { $size: '$newPatients' }
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        appointmentStats,
        dailyAppointments,
        revenue: revenueStats[0] || { totalRevenue: 0, averageRevenue: 0 },
        patientGrowth,
        summary: {
          totalAppointments: dailyAppointments.reduce((sum, d) => sum + d.count, 0),
          completedAppointments: dailyAppointments.reduce((sum, d) => sum + d.completed, 0),
          totalRevenue: revenueStats[0]?.totalRevenue || 0
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get available doctors
router.get('/available', async (req, res) => {
  try {
    const { specialization, type, date, time } = req.query;

    let query = { status: 'Active' };
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }

    const doctors = await Doctor.find(query);

    // Filter doctors based on availability
    let availableDoctors = doctors;
    if (date && time && type) {
      const appointmentDate = new Date(date);
      const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      availableDoctors = doctors.filter(doctor => 
        doctor.isAvailable(dayName, time, type)
      );
    }

    res.json({
      success: true,
      data: availableDoctors.map(doctor => ({
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        rating: doctor.rating,
        totalPatients: doctor.totalPatients
      }))
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all doctors (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, specialization, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (specialization) query.specialization = { $in: [specialization] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password -bankDetails');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update doctor status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.status = status;
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor status updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify doctor (admin only)
router.patch('/:id/verify', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.isVerified = true;
    doctor.status = 'Active';
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor verified successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete doctor (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor has any appointments
    const appointments = await Appointment.find({ doctor: req.params.id });
    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete doctor with existing appointments'
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;