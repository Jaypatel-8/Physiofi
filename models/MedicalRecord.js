const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  record_type: {
    type: String,
    enum: ['Lab Report', 'X-Ray', 'MRI', 'CT Scan', 'Prescription', 'Other'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  file_url: {
    type: String,
    required: true
  },
  file_name: {
    type: String,
    required: true
  },
  file_size: Number,
  file_type: String,
  uploaded_by: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin'],
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  },
  is_private: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ appointment: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);





