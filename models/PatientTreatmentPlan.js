const mongoose = require('mongoose');

const patientTreatmentPlanSchema = new mongoose.Schema({
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
  condition: {
    type: String,
    required: true,
    trim: true
  },
  conditionSlug: {
    type: String,
    required: true
  },
  treatmentPlan: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  sessions: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused', 'Cancelled'],
    default: 'Active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    note: String,
    addedBy: {
      type: String,
      enum: ['doctor', 'patient'],
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  exercises: [{
    name: String,
    description: String,
    sets: Number,
    reps: Number,
    frequency: String,
    instructions: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
patientTreatmentPlanSchema.index({ patient: 1, doctor: 1 });
patientTreatmentPlanSchema.index({ patient: 1, status: 1 });
patientTreatmentPlanSchema.index({ doctor: 1, status: 1 });
patientTreatmentPlanSchema.index({ conditionSlug: 1 });

module.exports = mongoose.model('PatientTreatmentPlan', patientTreatmentPlanSchema);



