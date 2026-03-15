const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
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
  session_date: {
    type: Date,
    required: true
  },
  subjective: {
    type: String,
    trim: true // Patient's complaints, symptoms
  },
  objective: {
    type: String,
    trim: true // Observations, measurements
  },
  assessment: {
    type: String,
    trim: true // Clinical assessment
  },
  plan: {
    type: String,
    trim: true // Treatment plan
  },
  treatment_provided: {
    type: String,
    trim: true
  },
  patient_response: {
    type: String,
    trim: true
  },
  next_steps: {
    type: String,
    trim: true
  },
  is_read_only: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

sessionNoteSchema.index({ appointment: 1 });
sessionNoteSchema.index({ patient: 1, session_date: -1 });
sessionNoteSchema.index({ doctor: 1 });

module.exports = mongoose.model('SessionNote', sessionNoteSchema);





