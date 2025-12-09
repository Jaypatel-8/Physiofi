/**
 * Test script to verify API endpoints are properly configured
 * Run with: node test-api-endpoints.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing API Endpoints Configuration...\n');

// Check if route files exist
const routesToCheck = [
  'routes/auth.js',
  'routes/patients.js',
  'routes/doctors.js',
  'routes/appointments.js',
  'routes/admin.js',
  'routes/medicalRecords.js',
  'routes/prescriptions.js',
  'routes/exercisePlans.js',
  'routes/sessionNotes.js',
  'routes/payments.js'
];

console.log('📁 Checking route files...');
let allRoutesExist = true;
routesToCheck.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`  ✅ ${route}`);
  } else {
    console.log(`  ❌ ${route} - NOT FOUND`);
    allRoutesExist = false;
  }
});

// Check if model files exist
const modelsToCheck = [
  'models/Patient.js',
  'models/Doctor.js',
  'models/Admin.js',
  'models/Appointment.js',
  'models/MedicalRecord.js',
  'models/Prescription.js',
  'models/ExercisePlan.js',
  'models/SessionNote.js',
  'models/Payment.js'
];

console.log('\n📦 Checking model files...');
let allModelsExist = true;
modelsToCheck.forEach(model => {
  if (fs.existsSync(model)) {
    console.log(`  ✅ ${model}`);
  } else {
    console.log(`  ❌ ${model} - NOT FOUND`);
    allModelsExist = false;
  }
});

// Check middleware
console.log('\n🔒 Checking middleware...');
if (fs.existsSync('middleware/rbac.js')) {
  console.log('  ✅ middleware/rbac.js');
} else {
  console.log('  ❌ middleware/rbac.js - NOT FOUND');
  allModelsExist = false;
}

// Check server.js
console.log('\n🖥️  Checking server configuration...');
if (fs.existsSync('server.js')) {
  const serverContent = fs.readFileSync('server.js', 'utf8');
  const hasAllRoutes = routesToCheck.every(route => {
    const routeName = path.basename(route, '.js');
    return serverContent.includes(`require('./${route}')`) || 
           serverContent.includes(`require('./routes/${routeName}')`);
  });
  
  if (hasAllRoutes) {
    console.log('  ✅ All routes registered in server.js');
  } else {
    console.log('  ⚠️  Some routes may not be registered');
  }
} else {
  console.log('  ❌ server.js - NOT FOUND');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allRoutesExist && allModelsExist) {
  console.log('✅ All files are in place!');
  console.log('\n🚀 Ready to start the server:');
  console.log('   npm run dev');
} else {
  console.log('❌ Some files are missing. Please check above.');
}
console.log('='.repeat(50));



