const express = require('express');
const router = express.Router();
const { isPatient, isDoctor, isAdminOrDoctor } = require('../middleware/rbac');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all medical records for a patient (Patient can see their own, Doctor/Admin can see all)
router.get('/', isAdminOrDoctor, async (req, res) => {
  try {
    const { patientId } = req.query;
    const query = patientId ? { patient: patientId } : {};

    const records = await MedicalRecord.find(query)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { records }
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient's own medical records
router.get('/my-records', isPatient, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user.userId })
      .populate('doctor', 'full_name name specialization')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { records }
    });
  } catch (error) {
    console.error('Get my medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single medical record
router.get('/:id', isAdminOrDoctor, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'full_name name email phone')
      .populate('doctor', 'full_name name specialization')
      .populate('appointment');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check if patient is accessing their own record
    if (req.user.role === 'patient' && record.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { record }
    });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload medical record (Patient or Doctor can upload)
router.post('/', isAdminOrDoctor, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      record_type,
      title,
      description,
      file_url,
      file_name,
      file_size,
      file_type,
      is_private
    } = req.body;

    if (!patientId || !record_type || !title || !file_url || !file_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
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

    const record = new MedicalRecord({
      patient: patientId,
      doctor: req.user.role === 'doctor' ? req.user.userId : null,
      appointment: appointmentId || null,
      record_type,
      title,
      description: description || '',
      file_url,
      file_name,
      file_size: file_size || 0,
      file_type: file_type || '',
      uploaded_by: req.user.role === 'patient' ? 'Patient' : req.user.role === 'doctor' ? 'Doctor' : 'Admin',
      is_private: is_private || false
    });

    await record.save();

    res.status(201).json({
      success: true,
      message: 'Medical record uploaded successfully',
      data: { record }
    });
  } catch (error) {
    console.error('Upload medical record error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Patient upload their own medical record
router.post('/upload', isPatient, async (req, res) => {
  try {
    const {
      appointmentId,
      record_type,
      title,
      description,
      file_url,
      file_name,
      file_size,
      file_type,
      is_private
    } = req.body;

    if (!record_type || !title || !file_url || !file_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const record = new MedicalRecord({
      patient: req.user.userId,
      doctor: null,
      appointment: appointmentId || null,
      record_type,
      title,
      description: description || '',
      file_url,
      file_name,
      file_size: file_size || 0,
      file_type: file_type || '',
      uploaded_by: 'Patient',
      is_private: is_private || false
    });

    await record.save();

    res.status(201).json({
      success: true,
      message: 'Medical record uploaded successfully',
      data: { record }
    });
  } catch (error) {
    console.error('Upload medical record error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Delete medical record (Only Doctor/Admin can delete)
router.delete('/:id', isAdminOrDoctor, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;





