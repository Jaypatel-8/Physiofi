const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Home Visit', 'Online Consultation', 'Clinic Visit'],
    required: true
  },
  service: {
    name: String,
    description: String,
    price: Number,
    duration: Number // in minutes
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Pending'
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  symptoms: [String],
  medicalHistory: String,
  currentMedications: [String],
  allergies: [String],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    notes: String
  },
  diagnosis: {
    primary: String,
    secondary: [String],
    notes: String
  },
  treatment: {
    plan: String,
    exercises: [{
      name: String,
      description: String,
      repetitions: Number,
      sets: Number,
      frequency: String,
      duration: Number
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    recommendations: [String]
  },
  progress: {
    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    notes: String,
    improvements: [String],
    concerns: [String]
  },
  followUp: {
    required: Boolean,
    date: Date,
    notes: String
  },
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    method: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet'],
      default: 'Cash'
    },
    transactionId: String,
    paidAt: Date
  },
  notes: {
    patient: String,
    doctor: String,
    admin: String
  },
  attachments: [{
    type: String,
    url: String,
    name: String,
    uploadedBy: {
      type: String,
      enum: ['Patient', 'Doctor', 'Admin']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rescheduleHistory: [{
    fromDate: Date,
    toDate: Date,
    reason: String,
    requestedBy: {
      type: String,
      enum: ['Patient', 'Doctor', 'Admin']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin']
  },
  cancelledAt: Date,
  completedAt: Date,
  duration: Number, // actual duration in minutes
  rating: {
    patient: {
      rating: Number,
      review: String,
      createdAt: Date
    },
    doctor: {
      rating: Number,
      review: String,
      createdAt: Date
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ type: 1 });

// Virtual for appointment status color
appointmentSchema.virtual('statusColor').get(function() {
  const statusColors = {
    'Pending': 'yellow',
    'Confirmed': 'blue',
    'In Progress': 'purple',
    'Completed': 'green',
    'Cancelled': 'red',
    'Rescheduled': 'orange'
  };
  return statusColors[this.status] || 'gray';
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.appointmentDate);
  const timeDiff = appointmentDateTime - now;
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  return this.status === 'Pending' || this.status === 'Confirmed' && hoursDiff > 2;
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.appointmentDate);
  const timeDiff = appointmentDateTime - now;
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  return this.status === 'Pending' || this.status === 'Confirmed' && hoursDiff > 24;
};

// Method to reschedule appointment
appointmentSchema.methods.reschedule = function(newDate, newTime, reason, requestedBy) {
  this.rescheduleHistory.push({
    fromDate: this.appointmentDate,
    toDate: newDate,
    reason: reason,
    requestedBy: requestedBy
  });
  
  this.appointmentDate = newDate;
  this.appointmentTime = newTime;
  this.status = 'Rescheduled';
  
  return this.save();
};

// Method to cancel appointment
appointmentSchema.methods.cancel = function(reason, cancelledBy) {
  this.status = 'Cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  
  return this.save();
};

// Method to complete appointment
appointmentSchema.methods.complete = function(notes, progress) {
  this.status = 'Completed';
  this.notes.doctor = notes;
  this.progress.notes = progress;
  this.completedAt = new Date();
  
  return this.save();
};

// Method to update progress
appointmentSchema.methods.updateProgress = function(level, notes, improvements, concerns) {
  this.progress.level = level;
  this.progress.notes = notes;
  if (improvements) this.progress.improvements = improvements;
  if (concerns) this.progress.concerns = concerns;
  
  return this.save();
};

// Static method to get appointments by date range
appointmentSchema.statics.getByDateRange = function(startDate, endDate, doctorId = null) {
  const query = {
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to get today's appointments
appointmentSchema.statics.getTodaysAppointments = function(doctorId = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const query = {
    appointmentDate: {
      $gte: today,
      $lt: tomorrow
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .sort({ appointmentTime: 1 });
};

module.exports = mongoose.model('Appointment', appointmentSchema);