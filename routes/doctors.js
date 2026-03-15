const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const DoctorCondition = require('../models/DoctorCondition');
const PatientTreatmentPlan = require('../models/PatientTreatmentPlan');
const { isDoctor, isAdminOrDoctor } = require('../middleware/rbac');
const router = express.Router();

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
      .select('name email phone specialization experience license address occupation')
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

// Get doctor by ID with conditions (public route for patients)
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Only show doctor profile to patients when approved (Active)
    const doctorStatus = doctor.status || 'Active';
    if (doctorStatus !== 'Active') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get doctor's conditions and treatment plans
    const conditions = await DoctorCondition.find({
      doctor: req.params.id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        doctor,
        conditions
      }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor profile
router.get('/profile', isDoctor, async (req, res) => {
  try {
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
router.put('/profile', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      name,
      phone,
      email,
      specialization,
      occupation,
      qualifications,
      experience,
      education,
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
    if (phone) doctor.phone = phone;
    if (email) doctor.email = email;
    if (specialization !== undefined) {
      // Handle both string and array
      doctor.specialization = Array.isArray(specialization) ? specialization : [specialization];
    }
    if (occupation) doctor.occupation = occupation;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience !== undefined) doctor.experience = experience;
    if (education) doctor.qualifications = [{ degree: education, institution: '', year: null }];
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

// Get doctor conditions and treatment plans
router.get('/conditions', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const conditions = await DoctorCondition.find({ 
      doctor: req.user.userId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    console.error('Get doctor conditions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add condition and treatment plan
router.post('/conditions', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { condition, conditionSlug, treatmentPlan, duration, sessions, price, description, successRate } = req.body;

    if (!condition || !treatmentPlan || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide condition, treatment plan, and duration'
      });
    }

    const doctorCondition = new DoctorCondition({
      doctor: req.user.userId,
      condition,
      conditionSlug: conditionSlug || condition.toLowerCase().replace(/\s+/g, '-'),
      treatmentPlan,
      duration,
      sessions: sessions || 0,
      price: price || 0,
      description,
      successRate: successRate || 0
    });

    await doctorCondition.save();

    res.json({
      success: true,
      message: 'Condition and treatment plan added successfully',
      data: doctorCondition
    });
  } catch (error) {
    console.error('Add doctor condition error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update condition and treatment plan
router.put('/conditions/:id', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorCondition = await DoctorCondition.findOne({
      _id: req.params.id,
      doctor: req.user.userId
    });

    if (!doctorCondition) {
      return res.status(404).json({
        success: false,
        message: 'Condition not found'
      });
    }

    const { condition, treatmentPlan, duration, sessions, price, description, successRate, isActive } = req.body;

    if (condition) doctorCondition.condition = condition;
    if (treatmentPlan) doctorCondition.treatmentPlan = treatmentPlan;
    if (duration) doctorCondition.duration = duration;
    if (sessions !== undefined) doctorCondition.sessions = sessions;
    if (price !== undefined) doctorCondition.price = price;
    if (description !== undefined) doctorCondition.description = description;
    if (successRate !== undefined) doctorCondition.successRate = successRate;
    if (isActive !== undefined) doctorCondition.isActive = isActive;

    await doctorCondition.save();

    res.json({
      success: true,
      message: 'Condition updated successfully',
      data: doctorCondition
    });
  } catch (error) {
    console.error('Update doctor condition error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete condition
router.delete('/conditions/:id', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorCondition = await DoctorCondition.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user.userId
    });

    if (!doctorCondition) {
      return res.status(404).json({
        success: false,
        message: 'Condition not found'
      });
    }

    res.json({
      success: true,
      message: 'Condition deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor condition error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor stats
router.get('/stats', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;
    const now = new Date();

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
    
    // Calculate today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointmentsCount = await Appointment.countDocuments({
      doctor: new mongoose.Types.ObjectId(doctorId),
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Calculate monthly earnings
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarningsResult = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          status: 'Completed',
          appointmentDate: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalAppointments: stats[0]?.totalAppointments || 0,
          completedAppointments: stats[0]?.completedAppointments || 0,
          pendingAppointments: stats[0]?.pendingAppointments || 0,
          confirmedAppointments: stats[0]?.confirmedAppointments || 0,
          todayAppointments: todayAppointmentsCount,
          totalPatients: doctor?.totalPatients || 0,
          totalSessions: doctor?.totalSessions || 0,
          monthlyEarnings: monthlyEarningsResult[0]?.total || 0,
          averageRating: doctor?.rating?.average || stats[0]?.averageRating || 0
        }
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
router.get('/patients', isDoctor, async (req, res) => {
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

    const total = patients.length;
    const paginatedPatients = patients.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        patients: paginatedPatients,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
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

// Get patient details
router.get('/patients/:patientId', isDoctor, async (req, res) => {
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

    // Get all treatment plans for this patient
    const treatmentPlans = await PatientTreatmentPlan.find({
      doctor: doctorId,
      patient: patientId
    })
    .sort({ createdAt: -1 })
    .lean();

    res.json({
      success: true,
      data: {
        patient,
        appointments,
        treatmentPlans,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'Completed').length,
        activeTreatmentPlans: treatmentPlans.filter(tp => tp.status === 'Active').length
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

// Get patient treatment plans (doctor view)
router.get('/patients/:patientId/treatment-plans', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;
    const { patientId } = req.params;

    const treatmentPlans = await PatientTreatmentPlan.find({
      doctor: doctorId,
      patient: patientId
    })
    .sort({ createdAt: -1 })
    .populate('patient', 'name email phone')
    .lean();

    res.json({
      success: true,
      data: { treatmentPlans }
    });
  } catch (error) {
    console.error('Get patient treatment plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create treatment plan for patient
router.post('/patients/:patientId/treatment-plans', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const doctorId = req.user.userId;
    const { patientId } = req.params;
    const {
      condition,
      conditionSlug,
      treatmentPlan,
      duration,
      sessions,
      price,
      description,
      exercises,
      medications
    } = req.body;

    if (!condition || !treatmentPlan || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide condition, treatment plan, and duration'
      });
    }

    const patientTreatmentPlan = new PatientTreatmentPlan({
      patient: patientId,
      doctor: doctorId,
      condition,
      conditionSlug: conditionSlug || condition.toLowerCase().replace(/\s+/g, '-'),
      treatmentPlan,
      duration,
      sessions: sessions || 0,
      price: price || 0,
      description,
      exercises: exercises || [],
      medications: medications || [],
      status: 'Active',
      startDate: new Date()
    });

    await patientTreatmentPlan.save();

    res.json({
      success: true,
      message: 'Treatment plan created successfully',
      data: patientTreatmentPlan
    });
  } catch (error) {
    console.error('Create treatment plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update treatment plan
router.put('/treatment-plans/:id', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const treatmentPlan = await PatientTreatmentPlan.findOne({
      _id: req.params.id,
      doctor: req.user.userId
    });

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: 'Treatment plan not found'
      });
    }

    const {
      condition,
      treatmentPlan: plan,
      duration,
      sessions,
      completedSessions,
      price,
      description,
      status,
      progress,
      exercises,
      medications,
      notes
    } = req.body;

    if (condition) treatmentPlan.condition = condition;
    if (plan) treatmentPlan.treatmentPlan = plan;
    if (duration) treatmentPlan.duration = duration;
    if (sessions !== undefined) treatmentPlan.sessions = sessions;
    if (completedSessions !== undefined) treatmentPlan.completedSessions = completedSessions;
    if (price !== undefined) treatmentPlan.price = price;
    if (description !== undefined) treatmentPlan.description = description;
    if (status) treatmentPlan.status = status;
    if (progress !== undefined) treatmentPlan.progress = progress;
    if (exercises) treatmentPlan.exercises = exercises;
    if (medications) treatmentPlan.medications = medications;
    if (notes) {
      treatmentPlan.notes.push({
        note: notes,
        addedBy: 'doctor',
        addedAt: new Date()
      });
    }

    // Auto-calculate progress based on completed sessions
    if (treatmentPlan.sessions > 0) {
      treatmentPlan.progress = Math.round((treatmentPlan.completedSessions / treatmentPlan.sessions) * 100);
    }

    // Mark as completed if all sessions are done
    if (treatmentPlan.completedSessions >= treatmentPlan.sessions && treatmentPlan.sessions > 0) {
      treatmentPlan.status = 'Completed';
      treatmentPlan.endDate = new Date();
      treatmentPlan.progress = 100;
    }

    await treatmentPlan.save();

    res.json({
      success: true,
      message: 'Treatment plan updated successfully',
      data: treatmentPlan
    });
  } catch (error) {
    console.error('Update treatment plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete treatment plan
router.delete('/treatment-plans/:id', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const treatmentPlan = await PatientTreatmentPlan.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user.userId
    });

    if (!treatmentPlan) {
      return res.status(404).json({
        success: false,
        message: 'Treatment plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Treatment plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete treatment plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor availability
router.get('/availability', isDoctor, async (req, res) => {
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

    // Convert weekly availability to simple format
    const weekly = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
      const daySlots = doctor.availability[day] || [];
      if (daySlots.length > 0) {
        // Get the first slot's times (assuming all slots have same times)
        weekly[day] = {
          available: true,
          start: daySlots[0].start,
          end: daySlots[0].end
        };
      } else {
        weekly[day] = {
          available: false,
          start: '09:00',
          end: '18:00'
        };
      }
    });

    // Format date-specific availability
    const dates = (doctor.dateSpecificAvailability || []).map(da => ({
      date: da.date.toISOString().split('T')[0],
      start: da.start,
      end: da.end,
      available: da.available,
      note: da.note || ''
    }));

    res.json({
      success: true,
      data: {
        weekly,
        dates
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update doctor availability
router.patch('/availability', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { weekly, dates } = req.body;

    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update weekly availability
    if (weekly) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      days.forEach(day => {
        if (weekly[day] !== undefined) {
          const dayData = weekly[day];
          if (dayData.available === false) {
            // If not available, set empty array
            doctor.availability[day] = [];
          } else if (dayData.available === true && dayData.start && dayData.end) {
            // If available, create slot array
            // Default to all service types if not specified
            const serviceTypes = ['Home Visit', 'Online Consultation', 'Clinic Visit'];
            doctor.availability[day] = serviceTypes.map(type => ({
              start: dayData.start,
              end: dayData.end,
              type: type
            }));
          }
        }
      });
    }

    // Update date-specific availability
    if (dates && Array.isArray(dates)) {
      doctor.dateSpecificAvailability = dates.map(da => ({
        date: new Date(da.date),
        start: da.start,
        end: da.end,
        available: da.available !== false,
        note: da.note || ''
      }));
    }

    await doctor.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        weekly: doctor.availability,
        dates: doctor.dateSpecificAvailability
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get analytics for doctor
router.get('/analytics', isDoctor, async (req, res) => {
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

    const doctor = await Doctor.findById(doctorId);

    // Get total patients for this doctor
    const uniquePatients = await Appointment.distinct('patient', {
      doctor: new mongoose.Types.ObjectId(doctorId)
    });
    const totalPatients = uniquePatients.length;

    res.json({
      success: true,
      data: {
        period,
        totalPatients,
        totalAppointments: dailyAppointments.reduce((sum, d) => sum + d.count, 0),
        earnings: revenueStats[0]?.totalRevenue || 0,
        rating: doctor?.rating?.average || 0,
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

// Get appointments
router.get('/appointments', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, type, page = 1, limit = 10, sort = 'date' } = req.query;
    const skip = (page - 1) * limit;

    let query = { doctor: req.user.userId };
    if (status) query.status = status;
    if (type) query.type = type;

    let sortOption = {};
    if (sort === 'date') {
      sortOption = { appointmentDate: -1, appointmentTime: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone age gender address')
      .sort(sortOption)
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
router.get('/appointments/:id', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone age gender address')
      .populate('doctor', 'name specialization email phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.doctor._id.toString() !== req.user.userId) {
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

// Update appointment status (Accept/Decline)
router.put('/appointments/:id/status', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, notes } = req.body;

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

    const oldStatus = appointment.status;
    appointment.status = status;
    if (notes) appointment.notes.doctor = notes;

    if (status === 'Completed') {
      appointment.completedAt = new Date();
    }

    if (status === 'Cancelled') {
      appointment.cancelledBy = 'Doctor';
      appointment.cancelledAt = new Date();
    }

    await appointment.save();

    // Create notification for status change
    if (oldStatus !== status) {
      try {
        const Notification = require('../models/Notification');
        await appointment.populate('patient', 'name');
        
        let notificationMessage = '';
        if (status === 'Confirmed') {
          notificationMessage = `Dr. ${req.user.name || 'Your doctor'} has confirmed your appointment`;
        } else if (status === 'Cancelled') {
          notificationMessage = `Dr. ${req.user.name || 'Your doctor'} has cancelled your appointment`;
        }

        if (notificationMessage) {
          await Notification.create({
            user: appointment.patient._id,
            userModel: 'Patient',
            type: 'appointment_status_change',
            title: 'Appointment Status Updated',
            message: notificationMessage,
            appointment: appointment._id,
            isRead: false
          });
        }
      } catch (notificationError) {
        console.error('Error creating status change notification:', notificationError);
      }
    }

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

// Add prescription
router.post('/appointments/:id/prescription', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { prescription } = req.body;

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

    appointment.treatment.medications = prescription;
    await appointment.save();

    res.json({
      success: true,
      message: 'Prescription added successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add exercises
router.post('/appointments/:id/exercises', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { exercises } = req.body;

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

    appointment.treatment.exercises = exercises;
    await appointment.save();

    res.json({
      success: true,
      message: 'Exercises added successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Add exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get notifications
router.get('/notifications', isDoctor, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const Notification = require('../models/Notification');
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      user: req.user.userId,
      userModel: 'Doctor'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Notification.countDocuments({
      user: req.user.userId,
      userModel: 'Doctor'
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get available doctors for booking (public)
router.get('/available', async (req, res) => {
  try {
    const { specialization, type, date, time } = req.query;

    let query = { status: 'Active' };
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }

    const doctors = await Doctor.find(query);

    // Filter doctors based on availability
    const availableDoctors = doctors.filter(doctor => {
      if (!date || !time) return true;
      
      const appointmentDate = new Date(date);
      const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
      const daySchedule = doctor.availability[dayName];
      
      if (!daySchedule || daySchedule.length === 0) return false;
      
      return daySchedule.some(slot => {
        const slotStart = slot.start;
        const slotEnd = slot.end;
        return slot.type === type && time >= slotStart && time <= slotEnd;
      });
    });

    res.json({
      success: true,
      data: availableDoctors.map(doctor => ({
        _id: doctor._id,
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

// Get doctor availability slots for a specific date and service type (public)
router.get('/:id/availability-slots', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, serviceType } = req.query;

    if (!date || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Date and serviceType are required'
      });
    }

    const doctor = await Doctor.findById(id);
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

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Map service type to appointment type
    const appointmentTypeMap = {
      'home': 'Home Visit',
      'tele': 'Online Consultation',
      'clinic': 'Clinic Visit'
    };
    const appointmentType = appointmentTypeMap[serviceType] || serviceType;

    // Check date-specific availability first
    const dateStr = appointmentDate.toISOString().split('T')[0];
    const dateSpecific = doctor.dateSpecificAvailability?.find(da => {
      const daDateStr = da.date instanceof Date 
        ? da.date.toISOString().split('T')[0] 
        : da.date;
      return daDateStr === dateStr;
    });

    let availableSlots = [];

    if (dateSpecific && dateSpecific.available) {
      // Use date-specific availability
      const start = dateSpecific.start;
      const end = dateSpecific.end;
      availableSlots = generateTimeSlots(start, end, 60); // 60-minute slots
    } else {
      // Use weekly schedule
      const daySchedule = doctor.availability[dayName] || [];
      const relevantSlots = daySchedule.filter(slot => slot.type === appointmentType);
      
      if (relevantSlots.length > 0) {
        // Combine all slots for the day
        relevantSlots.forEach(slot => {
          const slots = generateTimeSlots(slot.start, slot.end, 60);
          availableSlots = [...availableSlots, ...slots];
        });
        // Remove duplicates and sort
        availableSlots = [...new Set(availableSlots)].sort();
      }
    }

    // Check existing appointments to remove booked slots
    const Appointment = require('../models/Appointment');
    const existingAppointments = await Appointment.find({
      doctor: id,
      appointmentDate: {
        $gte: new Date(dateStr + 'T00:00:00'),
        $lt: new Date(dateStr + 'T23:59:59')
      },
      status: { $in: ['Pending', 'Confirmed', 'Scheduled'] }
    });

    const bookedSlots = existingAppointments.map(apt => apt.appointmentTime);
    availableSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: {
        doctorId: id,
        doctorName: doctor.name,
        date: dateStr,
        serviceType: appointmentType,
        availableSlots,
        bookedSlots
      }
    });
  } catch (error) {
    console.error('Get availability slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, intervalMinutes = 60) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (
    currentHour < endHour || 
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }
  
  return slots;
}

// Get all doctors (admin)
router.get('/all', isDoctor, async (req, res) => {
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
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
