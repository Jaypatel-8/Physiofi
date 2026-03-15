const express = require('express');
const router = express.Router();
const { isPatient, isDoctor, isAdminOrDoctor } = require('../middleware/rbac');
const ExercisePlan = require('../models/ExercisePlan');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all exercise plans (Doctor/Admin can see all, Patient sees their own)
router.get('/', isAdminOrDoctor, async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    const query = {};
    
    if (patientId) query.patient = patientId;
    if (doctorId) query.doctor = doctorId;
    if (status) query.status = status;

    const plans = await ExercisePlan.find(query)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    console.error('Get exercise plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient's own exercise plans
router.get('/my-plans', isPatient, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { patient: req.user.userId };
    if (status) query.status = status;

    const plans = await ExercisePlan.find(query)
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    console.error('Get my exercise plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single exercise plan
router.get('/:id', isAdminOrDoctor, async (req, res) => {
  try {
    const plan = await ExercisePlan.findById(req.params.id)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check if patient is accessing their own plan
    if (req.user.role === 'patient' && plan.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { plan }
    });
  } catch (error) {
    console.error('Get exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create exercise plan (Only Doctor can create)
router.post('/', isDoctor, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      condition,
      plan_name,
      exercises,
      start_date,
      end_date
    } = req.body;

    if (!patientId || !condition || !plan_name || !exercises) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, condition, plan name, and exercises'
      });
    }

    // Enhanced validation
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one exercise'
      });
    }

    if (plan_name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Plan name must be at least 3 characters'
      });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Verify appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
    }

    const plan = new ExercisePlan({
      patient: patientId,
      doctor: req.user.userId,
      appointment: appointmentId || null,
      condition,
      plan_name,
      exercises: Array.isArray(exercises) ? exercises : [exercises],
      start_date: start_date || new Date(),
      end_date: end_date || null,
      status: 'Active'
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Exercise plan created successfully',
      data: { plan }
    });
  } catch (error) {
    console.error('Create exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Update exercise plan (Only Doctor can update)
router.put('/:id', isDoctor, async (req, res) => {
  try {
    const plan = await ExercisePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check if doctor owns this plan
    if (plan.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own exercise plans'
      });
    }

    const { condition, plan_name, exercises, start_date, end_date, status } = req.body;

    if (condition) plan.condition = condition;
    if (plan_name) plan.plan_name = plan_name;
    if (exercises) plan.exercises = Array.isArray(exercises) ? exercises : [exercises];
    if (start_date) plan.start_date = start_date;
    if (end_date !== undefined) plan.end_date = end_date;
    if (status) plan.status = status;

    await plan.save();

    res.json({
      success: true,
      message: 'Exercise plan updated successfully',
      data: { plan }
    });
  } catch (error) {
    console.error('Update exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Update exercise progress (Patient can update their progress)
router.post('/:id/progress', isPatient, async (req, res) => {
  try {
    const plan = await ExercisePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check if patient owns this plan
    if (plan.patient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own exercise plans'
      });
    }

    const { exercise_name, repetitions_completed, sets_completed, notes } = req.body;

    if (!exercise_name) {
      return res.status(400).json({
        success: false,
        message: 'Exercise name is required'
      });
    }

    plan.progress.push({
      exercise_name,
      completed_date: new Date(),
      repetitions_completed: repetitions_completed || 0,
      sets_completed: sets_completed || 0,
      notes: notes || ''
    });

    await plan.save();

    res.json({
      success: true,
      message: 'Exercise progress updated successfully',
      data: { plan }
    });
  } catch (error) {
    console.error('Update exercise progress error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Delete exercise plan (Only Doctor can delete)
router.delete('/:id', isDoctor, async (req, res) => {
  try {
    const plan = await ExercisePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Exercise plan not found'
      });
    }

    // Check if doctor owns this plan
    if (plan.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own exercise plans'
      });
    }

    await ExercisePlan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Exercise plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete exercise plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;





