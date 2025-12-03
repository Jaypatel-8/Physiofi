const mongoose = require('mongoose');

const doctorConditionSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
doctorConditionSchema.index({ doctor: 1, condition: 1 });
doctorConditionSchema.index({ conditionSlug: 1 });
doctorConditionSchema.index({ isActive: 1 });

module.exports = mongoose.model('DoctorCondition', doctorConditionSchema);

