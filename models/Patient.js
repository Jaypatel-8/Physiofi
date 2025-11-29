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
  otp: {
    code: String,
    expiresAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
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

// Method to generate OTP
patientSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to verify OTP
patientSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  if (this.otp.expiresAt < new Date()) {
    return false;
  }
  
  return this.otp.code === otp;
};

// Method to update recovery progress
patientSchema.methods.updateProgress = function(progress) {
  this.recoveryProgress = Math.min(100, Math.max(0, progress));
  return this.save();
};

module.exports = mongoose.model('Patient', patientSchema);