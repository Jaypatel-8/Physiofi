const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  full_name: {
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
  password_hash: {
    type: String,
    required: false // Allow legacy records without password_hash
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
    type: String,
    trim: true
  },
  emergency_contact: {
    name: String,
    phone: String,
    relation: String
  },
  medical_history: {
    type: String,
    trim: true
  },
  current_conditions: {
    type: String,
    trim: true
  },
  profile_image_url: {
    type: String,
    default: null
  },
  // Legacy fields for backward compatibility
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
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
  const hashToCompare = this.password_hash || this.password;
  
  if (!hashToCompare) {
    console.error('No password hash found for patient:', this._id);
    return false;
  }
  
  // Check if hashToCompare is actually a hash (starts with $2a$, $2b$, or $2y$)
  if (!hashToCompare.startsWith('$2')) {
    console.error('Invalid password hash format for patient:', this._id);
    return false;
  }
  
  try {
    const result = await bcrypt.compare(candidatePassword, hashToCompare);
    if (!result) {
      console.log('Password comparison failed for patient:', this._id);
    }
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Method to update recovery progress
patientSchema.methods.updateProgress = function(progress) {
  this.recoveryProgress = Math.min(100, Math.max(0, progress));
  return this.save();
};

// Pre-save middleware to hash password
patientSchema.pre('save', async function(next) {
  try {
    // Handle both password and password_hash fields
    if (this.isModified('password') && this.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      this.password_hash = await bcrypt.hash(this.password, salt);
      this.password = undefined; // Don't store plain password
    } else if ((this.isModified('password_hash') || !this.password_hash) && this.password) {
      // If password_hash is missing but password exists, hash it
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      this.password_hash = await bcrypt.hash(this.password, salt);
      this.password = undefined;
    }
    
    // Ensure password_hash exists (for legacy records)
    if (!this.password_hash && !this.isNew) {
      // For existing records without password_hash, skip validation
      // This allows legacy records to be saved
    }
    
    // Sync name with full_name
    if (this.isModified('full_name') && this.full_name && !this.name) {
      this.name = this.full_name;
    } else if (this.isModified('name') && this.name && !this.full_name) {
      this.full_name = this.name;
    }
    
    next();
  } catch (error) {
    console.error('Pre-save error:', error);
    next(error);
  }
});

module.exports = mongoose.model('Patient', patientSchema);