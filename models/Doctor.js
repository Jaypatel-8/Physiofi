const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
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
  specialization: {
    type: [String],
    required: true
  },
  occupation: {
    type: String,
    trim: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  license: {
    type: String,
    required: true,
    unique: true
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
  availability: {
    monday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    tuesday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    wednesday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    thursday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    friday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    saturday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }],
    sunday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic Visit']
      }
    }]
  },
  dateSpecificAvailability: [{
    date: {
      type: Date,
      required: true
    },
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    note: {
      type: String,
      trim: true
    }
  }],
  services: [{
    name: String,
    description: String,
    price: Number,
    duration: Number // in minutes
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'Suspended'],
    default: 'Active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: Date,
  bio: String,
  profileImage: String,
  documents: [{
    type: String,
    url: String,
    name: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
doctorSchema.index({ email: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ 'rating.average': -1 });

// Virtual for full address
doctorSchema.virtual('fullAddress').get(function() {
  const address = this.address;
  if (!address) return '';
  
  const parts = [address.street, address.city, address.state, address.pincode, address.country]
    .filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
});

// Method to update rating
doctorSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

// Method to check availability
doctorSchema.methods.isAvailable = function(day, time, type, specificDate = null) {
  // First check date-specific availability if a specific date is provided
  if (specificDate) {
    const dateStr = specificDate instanceof Date 
      ? specificDate.toISOString().split('T')[0] 
      : specificDate;
    
    const dateSpecific = this.dateSpecificAvailability?.find(da => {
      const daDateStr = da.date instanceof Date 
        ? da.date.toISOString().split('T')[0] 
        : da.date;
      return daDateStr === dateStr;
    });
    
    if (dateSpecific) {
      // If date-specific availability exists, use it
      if (!dateSpecific.available) return false;
      return time >= dateSpecific.start && time <= dateSpecific.end;
    }
  }
  
  // Otherwise, check weekly schedule
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule || daySchedule.length === 0) return false;
  
  return daySchedule.some(slot => {
    const slotStart = slot.start;
    const slotEnd = slot.end;
    // Match type (handle both 'Clinic' and 'Clinic Visit')
    const typeMatch = slot.type === type || 
                      (slot.type === 'Clinic' && type === 'Clinic Visit') ||
                      (slot.type === 'Clinic Visit' && type === 'Clinic');
    return typeMatch && time >= slotStart && time <= slotEnd;
  });
};

// Method to get available slots for a day
doctorSchema.methods.getAvailableSlots = function(day, type) {
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule) return [];
  
  return daySchedule.filter(slot => slot.type === type);
};

// Method to increment patient count
doctorSchema.methods.incrementPatientCount = function() {
  this.totalPatients += 1;
  return this.save();
};

// Method to increment session count
doctorSchema.methods.incrementSessionCount = function() {
  this.totalSessions += 1;
  return this.save();
};

// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to hash password
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);