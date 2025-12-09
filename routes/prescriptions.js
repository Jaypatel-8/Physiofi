const express = require('express');
const router = express.Router();
const { isPatient, isDoctor, isAdminOrDoctor } = require('../middleware/rbac');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all prescriptions (Doctor/Admin can see all, Patient sees their own)
router.get('/', isAdminOrDoctor, async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    const query = {};
    
    if (patientId) query.patient = patientId;
    if (doctorId) query.doctor = doctorId;

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ issued_at: -1 });

    res.json({
      success: true,
      data: { prescriptions }
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient's own prescriptions
router.get('/my-prescriptions', isPatient, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.userId })
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ issued_at: -1 });

    res.json({
      success: true,
      data: { prescriptions }
    });
  } catch (error) {
    console.error('Get my prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single prescription
router.get('/:id', isAdminOrDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check if patient is accessing their own prescription
    if (req.user.role === 'patient' && prescription.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { prescription }
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create prescription (Only Doctor can create)
router.post('/', isDoctor, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      medications,
      diagnosis,
      notes,
      follow_up_date,
      follow_up_required
    } = req.body;

    if (!patientId || !medications || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, medications, and diagnosis'
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

    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user.userId,
      appointment: appointmentId || null,
      medications: Array.isArray(medications) ? medications : [medications],
      diagnosis,
      notes: notes || '',
      follow_up_date: follow_up_date || null,
      follow_up_required: follow_up_required || false
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription }
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Update prescription (Only Doctor can update)
router.put('/:id', isDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check if doctor owns this prescription
    if (prescription.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own prescriptions'
      });
    }

    const { medications, diagnosis, notes, follow_up_date, follow_up_required } = req.body;

    if (medications) prescription.medications = Array.isArray(medications) ? medications : [medications];
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (notes !== undefined) prescription.notes = notes;
    if (follow_up_date !== undefined) prescription.follow_up_date = follow_up_date;
    if (follow_up_required !== undefined) prescription.follow_up_required = follow_up_required;

    await prescription.save();

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: { prescription }
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Delete prescription (Only Doctor can delete)
router.delete('/:id', isDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check if doctor owns this prescription
    if (prescription.doctor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own prescriptions'
      });
    }

    await Prescription.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;



