const express = require('express');
const router = express.Router();
const { isPatient, isDoctor, isAdminOrDoctor, isAuthenticated } = require('../middleware/rbac');
const SessionNote = require('../models/SessionNote');
const Appointment = require('../models/Appointment');

// Get all session notes (Doctor/Admin can see all, Patient sees their own - read only)
router.get('/', isAdminOrDoctor, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId } = req.query;
    const query = {};
    
    if (patientId) query.patient = patientId;
    if (doctorId) query.doctor = doctorId;
    if (appointmentId) query.appointment = appointmentId;

    const notes = await SessionNote.find(query)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ session_date: -1 });

    res.json({
      success: true,
      data: { notes }
    });
  } catch (error) {
    console.error('Get session notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient's own session notes (read only)
router.get('/my-notes', isPatient, async (req, res) => {
  try {
    const notes = await SessionNote.find({ patient: req.user.userId })
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ session_date: -1 });

    res.json({
      success: true,
      data: { notes }
    });
  } catch (error) {
    console.error('Get my session notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single session note (doctor/admin: any; patient: own only)
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await SessionNote.findById(req.params.id)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Session note not found'
      });
    }

    // Patient may only access their own note
    if (req.user.role === 'patient' && note.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Get session note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create session note (Only Doctor can create)
router.post('/', isDoctor, async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      session_date,
      subjective,
      objective,
      assessment,
      plan,
      treatment_provided,
      patient_response,
      next_steps
    } = req.body;

    if (!appointmentId || !patientId || !session_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointment, patient, and session date'
      });
    }

    // Validate session date
    const sessionDate = new Date(session_date);
    if (isNaN(sessionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid session date'
      });
    }

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if doctor owns this appointment
    if (appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only create notes for your own appointments'
      });
    }

    const note = new SessionNote({
      appointment: appointmentId,
      patient: patientId,
      doctor: req.user.userId,
      session_date,
      subjective: subjective || '',
      objective: objective || '',
      assessment: assessment || '',
      plan: plan || '',
      treatment_provided: treatment_provided || '',
      patient_response: patient_response || '',
      next_steps: next_steps || '',
      is_read_only: true // Patients can only read
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Session note created successfully',
      data: { note }
    });
  } catch (error) {
    console.error('Create session note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Update session note (Only Doctor can update)
router.put('/:id', isDoctor, async (req, res) => {
  try {
    const note = await SessionNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Session note not found'
      });
    }

    // Check if doctor owns this note
    if (note.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own session notes'
      });
    }

    const {
      session_date,
      subjective,
      objective,
      assessment,
      plan,
      treatment_provided,
      patient_response,
      next_steps
    } = req.body;

    if (session_date) note.session_date = session_date;
    if (subjective !== undefined) note.subjective = subjective;
    if (objective !== undefined) note.objective = objective;
    if (assessment !== undefined) note.assessment = assessment;
    if (plan !== undefined) note.plan = plan;
    if (treatment_provided !== undefined) note.treatment_provided = treatment_provided;
    if (patient_response !== undefined) note.patient_response = patient_response;
    if (next_steps !== undefined) note.next_steps = next_steps;

    await note.save();

    res.json({
      success: true,
      message: 'Session note updated successfully',
      data: { note }
    });
  } catch (error) {
    console.error('Update session note error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Delete session note (Only Doctor can delete)
router.delete('/:id', isDoctor, async (req, res) => {
  try {
    const note = await SessionNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Session note not found'
      });
    }

    // Check if doctor owns this note
    if (note.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own session notes'
      });
    }

    await SessionNote.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Session note deleted successfully'
    });
  } catch (error) {
    console.error('Delete session note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;





