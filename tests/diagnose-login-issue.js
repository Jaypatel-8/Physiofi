/**
 * Diagnostic script to check login issues
 * Run with: node diagnose-login-issue.js <email>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Admin = require('./models/Admin');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node diagnose-login-issue.js <email>');
  process.exit(1);
}

async function diagnoseLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/physiofi', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB\n');

    // Check Patient
    console.log('=== Checking Patient ===');
    const patient = await Patient.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    
    if (patient) {
      console.log('✓ Patient found');
      console.log('  ID:', patient._id);
      console.log('  Name:', patient.full_name || patient.name);
      console.log('  Email:', patient.email);
      console.log('  Status:', patient.status || 'Not set');
      console.log('  Has password_hash:', !!patient.password_hash);
      console.log('  Has password field:', !!patient.password);
      if (patient.password_hash) {
        console.log('  Password hash format:', patient.password_hash.substring(0, 7) + '...');
        console.log('  Hash length:', patient.password_hash.length);
      }
    } else {
      console.log('✗ Patient not found');
    }

    // Check Doctor
    console.log('\n=== Checking Doctor ===');
    const doctor = await Doctor.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    
    if (doctor) {
      console.log('✓ Doctor found');
      console.log('  ID:', doctor._id);
      console.log('  Name:', doctor.full_name || doctor.name);
      console.log('  Email:', doctor.email);
      console.log('  Status:', doctor.status || 'Not set');
      console.log('  Has password_hash:', !!doctor.password_hash);
      console.log('  Has password field:', !!doctor.password);
      if (doctor.password_hash) {
        console.log('  Password hash format:', doctor.password_hash.substring(0, 7) + '...');
        console.log('  Hash length:', doctor.password_hash.length);
      }
    } else {
      console.log('✗ Doctor not found');
    }

    // Check Admin
    console.log('\n=== Checking Admin ===');
    const admin = await Admin.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email }
      ]
    });
    
    if (admin) {
      console.log('✓ Admin found');
      console.log('  ID:', admin._id);
      console.log('  Name:', admin.full_name || admin.name);
      console.log('  Email:', admin.email);
      console.log('  Status:', admin.status || 'Not set');
      console.log('  Has password_hash:', !!admin.password_hash);
      console.log('  Has password field:', !!admin.password);
      if (admin.password_hash) {
        console.log('  Password hash format:', admin.password_hash.substring(0, 7) + '...');
        console.log('  Hash length:', admin.password_hash.length);
      }
    } else {
      console.log('✗ Admin not found');
    }

    // Summary
    console.log('\n=== Summary ===');
    if (!patient && !doctor && !admin) {
      console.log('❌ No user found with email:', email);
      console.log('   Try checking:');
      console.log('   1. Email spelling/case');
      console.log('   2. If user was registered');
      console.log('   3. Database connection');
    } else {
      const user = patient || doctor || admin;
      if (!user.password_hash && !user.password) {
        console.log('❌ User has no password set');
        console.log('   Solution: User needs to reset password');
      } else if (!user.password_hash && user.password) {
        console.log('⚠️  User has plain password but no hash');
        console.log('   Solution: Password needs to be re-hashed');
      } else if (user.password_hash && !user.password_hash.startsWith('$2')) {
        console.log('❌ Invalid password hash format');
        console.log('   Solution: Password needs to be reset');
      } else {
        console.log('✓ User account looks valid');
        if (!user.status || user.status !== 'Active') {
          console.log('⚠️  User status is not Active:', user.status || 'Not set');
        }
      }
    }

    await mongoose.connection.close();
    console.log('\nDiagnosis complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

diagnoseLogin();

