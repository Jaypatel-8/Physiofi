/**
 * Create or reset admin account so you can log in at /admin/login
 * Run from project root: node scripts/create-admin.js
 * Or: npm run create-admin
 */
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Admin = require('../models/Admin');

const DEFAULT_EMAIL = 'admin@physiofi.com';
const DEFAULT_PASSWORD = 'admin123';

async function run() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/physiofi';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected.\n');

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const normalizedEmail = DEFAULT_EMAIL.toLowerCase();

  let admin = await Admin.findOne({ email: normalizedEmail });

  if (admin) {
    console.log('Existing admin found. Resetting password and fixing account...');
    await Admin.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          full_name: admin.full_name || 'System Administrator',
          name: admin.name || admin.full_name || 'System Administrator',
          password_hash: passwordHash,
          role: 'superadmin',
          status: 'Active',
          phone: admin.phone || '+91 9998103191',
        },
        $unset: {
          lockUntil: 1,
          loginAttempts: 1,
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
        },
      }
    );
    console.log('Admin account updated successfully.\n');
  } else {
    console.log('No admin found. Creating new admin...');
    admin = new Admin({
      full_name: 'System Administrator',
      name: 'System Administrator',
      email: DEFAULT_EMAIL,
      phone: '+91 9998103191',
      password_hash: passwordHash,
      role: 'superadmin',
      department: 'Operations',
      status: 'Active',
      isVerified: true,
    });
    await admin.save();
    console.log('Admin account created successfully.\n');
  }

  console.log('========================================');
  console.log('  Admin login credentials');
  console.log('========================================');
  console.log('  URL:      /admin/login');
  console.log('  Email:   ', DEFAULT_EMAIL);
  console.log('  Password:', DEFAULT_PASSWORD);
  console.log('========================================\n');
  console.log('Start the app (npm run dev) then open the admin login page.');
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err.message || err);
    process.exit(1);
  })
  .finally(() => mongoose.connection.close());
