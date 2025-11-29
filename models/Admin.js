const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Manager', 'Support'],
    default: 'Admin'
  },
  permissions: [{
    module: String,
    actions: [String] // ['create', 'read', 'update', 'delete']
  }],
  department: {
    type: String,
    enum: ['Operations', 'Finance', 'HR', 'Support', 'Marketing'],
    default: 'Operations'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  password: {
    type: String,
    required: true
  },
  profileImage: String,
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
  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full address
adminSchema.virtual('fullAddress').get(function() {
  const address = this.address;
  if (!address) return '';
  
  const parts = [address.street, address.city, address.state, address.pincode, address.country]
    .filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
});

// Method to increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to check permission
adminSchema.methods.hasPermission = function(module, action) {
  if (this.role === 'Super Admin') return true;
  
  const permission = this.permissions.find(p => p.module === module);
  if (!permission) return false;
  
  return permission.actions.includes(action);
};

// Method to add permission
adminSchema.methods.addPermission = function(module, actions) {
  const existingPermission = this.permissions.find(p => p.module === module);
  
  if (existingPermission) {
    // Add new actions to existing permission
    const newActions = actions.filter(action => !existingPermission.actions.includes(action));
    existingPermission.actions = [...existingPermission.actions, ...newActions];
  } else {
    // Create new permission
    this.permissions.push({ module, actions });
  }
  
  return this.save();
};

// Method to remove permission
adminSchema.methods.removePermission = function(module, actions = null) {
  if (actions === null) {
    // Remove entire module permission
    this.permissions = this.permissions.filter(p => p.module !== module);
  } else {
    // Remove specific actions from module
    const permission = this.permissions.find(p => p.module === module);
    if (permission) {
      permission.actions = permission.actions.filter(action => !actions.includes(action));
      // If no actions left, remove the entire permission
      if (permission.actions.length === 0) {
        this.permissions = this.permissions.filter(p => p.module !== module);
      }
    }
  }
  
  return this.save();
};

// Method to update last login
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find by email
adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active admins
adminSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

// Static method to find by role
adminSchema.statics.findByRole = function(role) {
  return this.find({ role: role, status: 'Active' });
};

// Pre-save middleware to hash password
adminSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  // In a real application, you would hash the password here
  // For now, we'll just continue
  next();
});

module.exports = mongoose.model('Admin', adminSchema);