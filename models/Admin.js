const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'staff'],
    default: 'staff'
  },
  permissions: {
    type: mongoose.Schema.Types.Mixed, // JSON object
    default: {}
  },
  // Legacy fields for backward compatibility
  name: {
    type: String,
    trim: true
  },
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
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
  if (this.role === 'superadmin') return true;
  
  // Handle both array and object format for permissions
  if (Array.isArray(this.permissions)) {
    const permission = this.permissions.find(p => p.module === module);
    if (!permission) return false;
    return permission.actions.includes(action);
  } else if (typeof this.permissions === 'object' && this.permissions !== null) {
    const modulePerms = this.permissions[module];
    if (!modulePerms || !Array.isArray(modulePerms)) return false;
    return modulePerms.includes(action);
  }
  
  return false;
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

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  const hashToCompare = this.password_hash || this.password;
  
  if (!hashToCompare) {
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, hashToCompare);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Handle both password and password_hash fields
  if (this.isModified('password') && this.password) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password, salt);
    this.password = undefined; // Don't store plain password
  } else if (this.isModified('password_hash') && !this.password_hash && this.password) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password, salt);
    this.password = undefined;
  }
  
  // Sync name with full_name
  if (this.isModified('full_name') && this.full_name && !this.name) {
    this.name = this.full_name;
  } else if (this.isModified('name') && this.name && !this.full_name) {
    this.full_name = this.name;
  }
  
  // Normalize role
  if (this.isModified('role') && this.role) {
    const roleMap = {
      'Super Admin': 'superadmin',
      'Admin': 'staff',
      'Manager': 'staff',
      'Support': 'staff'
    };
    if (roleMap[this.role]) {
      this.role = roleMap[this.role];
    }
  }
  
  next();
});

module.exports = mongoose.model('Admin', adminSchema);