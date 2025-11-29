const express = require('express');
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
      { $match: { doctor: doctorId } },
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
        completedAppointments: stats[0]?.completedAppointments || 0,
        pendingAppointments: stats[0]?.pendingAppointments || 0,
        confirmedAppointments: stats[0]?.confirmedAppointments || 0,
        totalPatients: doctor?.totalPatients || 0,
        totalSessions: doctor?.totalSessions || 0,
        averageRating: stats[0]?.averageRating || 0,
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

// Update doctor availability
router.patch('/availability', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { day, slots } = req.body;

    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    doctor.availability[day] = slots;
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