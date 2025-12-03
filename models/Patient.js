const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  medicalHistory: [{
    condition: String,
    diagnosis: String,
    treatment: String,
    date: Date
  }],
  currentConditions: [{
    condition: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe']
    },
    notes: String
  }],
  preferences: {
    preferredTime: String,
    preferredTherapist: String,
    communicationMethod: {
      type: String,
      enum: ['Phone', 'Email', 'WhatsApp'],
      default: 'Phone'
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  totalAppointments: {
    type: Number,
    default: 0
  },
  recoveryProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ status: 1 });

// Virtual for full address
patientSchema.virtual('fullAddress').get(function() {
  const address = this.address;
  if (!address) return '';
  
  const parts = [address.street, address.city, address.state, address.pincode, address.country]
    .filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
});

// Method to compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update recovery progress
patientSchema.methods.updateProgress = function(progress) {
  this.recoveryProgress = Math.min(100, Math.max(0, progress));
  return this.save();
};

// Pre-save middleware to hash password
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Patient', patientSchema);