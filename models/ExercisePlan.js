const mongoose = require('mongoose');

const exercisePlanSchema = new mongoose.Schema({
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
  condition: {
    type: String,
    required: true,
    trim: true
  },
  plan_name: {
    type: String,
    required: true,
    trim: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    repetitions: Number,
    sets: Number,
    duration: Number, // in minutes
    frequency: {
      type: String,
      required: true // e.g., "Daily", "3 times a week"
    },
    instructions: {
      type: String,
      trim: true
    },
    video_url: String,
    image_url: String
  }],
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: Date,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused', 'Cancelled'],
    default: 'Active'
  },
  progress: [{
    exercise_name: String,
    completed_date: Date,
    repetitions_completed: Number,
    sets_completed: Number,
    notes: String
  }]
}, {
  timestamps: true
});

exercisePlanSchema.index({ patient: 1, status: 1 });
exercisePlanSchema.index({ doctor: 1 });
exercisePlanSchema.index({ appointment: 1 });

module.exports = mongoose.model('ExercisePlan', exercisePlanSchema);



