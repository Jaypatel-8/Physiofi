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
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    tuesday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    wednesday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    thursday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    friday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    saturday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }],
    sunday: [{
      start: String,
      end: String,
      type: {
        type: String,
        enum: ['Home Visit', 'Online Consultation', 'Clinic']
      }
    }]
  },
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
doctorSchema.methods.isAvailable = function(day, time, type) {
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule || daySchedule.length === 0) return false;
  
  return daySchedule.some(slot => {
    const slotStart = slot.start;
    const slotEnd = slot.end;
    return slot.type === type && time >= slotStart && time <= slotEnd;
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

module.exports = mongoose.model('Doctor', doctorSchema);