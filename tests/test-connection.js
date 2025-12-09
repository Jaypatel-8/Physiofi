/**
 * Test script to verify database connection and authentication flow
 * Run with: node test-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Admin = require('./models/Admin');

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Connection...\n');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/physiofi';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    console.log('');
    
    // Test Patient Registration
    console.log('🧪 Testing Patient Registration...');
    try {
      // Check if test patient exists
      let testPatient = await Patient.findOne({ email: 'test@physiofi.com' });
      
      if (!testPatient) {
        // Create test patient
        testPatient = new Patient({
          name: 'Test Patient',
          email: 'test@physiofi.com',
          phone: '1234567890',
          password: 'test123',
          age: 30,
          gender: 'Male',
          address: {
            street: '123 Test St',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380001',
            country: 'India'
          }
        });
        await testPatient.save();
        console.log('✅ Test patient created successfully!');
      } else {
        console.log('ℹ️  Test patient already exists');
      }
      
      // Test password comparison
      const isValidPassword = await testPatient.comparePassword('test123');
      console.log('✅ Password comparison test:', isValidPassword ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      console.error('❌ Patient registration test failed:', error.message);
    }
    
    console.log('');
    
    // Test Doctor Registration
    console.log('🧪 Testing Doctor Registration...');
    try {
      let testDoctor = await Doctor.findOne({ email: 'doctor@physiofi.com' });
      
      if (!testDoctor) {
        testDoctor = new Doctor({
          name: 'Test Doctor',
          email: 'doctor@physiofi.com',
          phone: '9876543210',
          password: 'doctor123',
          specialization: ['Orthopedic', 'Sports Medicine'],
          experience: 5,
          license: 'PT12345',
          bpt: {
            degree: 'BPT',
            institution: 'Test University',
            year: '2015'
          },
          address: {
            street: '456 Doctor St',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380001',
            country: 'India'
          },
          status: 'Active',
          isApproved: true
        });
        await testDoctor.save();
        console.log('✅ Test doctor created successfully!');
      } else {
        console.log('ℹ️  Test doctor already exists');
      }
      
      const isValidPassword = await testDoctor.comparePassword('doctor123');
      console.log('✅ Password comparison test:', isValidPassword ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      console.error('❌ Doctor registration test failed:', error.message);
    }
    
    console.log('');
    
    // Test Admin
    console.log('🧪 Testing Admin...');
    try {
      let testAdmin = await Admin.findOne({ email: 'admin@physiofi.com' });
      
      if (!testAdmin) {
        testAdmin = new Admin({
          name: 'Test Admin',
          email: 'admin@physiofi.com',
          phone: '5555555555',
          password: 'admin123',
          role: 'super_admin'
        });
        await testAdmin.save();
        console.log('✅ Test admin created successfully!');
      } else {
        console.log('ℹ️  Test admin already exists');
      }
      
      const isValidPassword = await testAdmin.comparePassword('admin123');
      console.log('✅ Password comparison test:', isValidPassword ? 'PASSED' : 'FAILED');
      
    } catch (error) {
      console.error('❌ Admin test failed:', error.message);
    }
    
    console.log('');
    console.log('📊 Database Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('');
    console.log('✅ All tests completed!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('   Patient: test@physiofi.com / test123');
    console.log('   Doctor:  doctor@physiofi.com / doctor123');
    console.log('   Admin:   admin@physiofi.com / admin123');
    console.log('');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in .env file');
    console.error('   3. Check network/firewall settings');
    process.exit(1);
  }
};

// Run the test
testConnection();



