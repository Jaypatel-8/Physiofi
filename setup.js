const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Admin = require('./models/Admin');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/physiofi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create default admin user (password is hashed by Admin model pre-save)
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@physiofi.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Default admin already exists');
      return existingAdmin;
    }

    const admin = new Admin({
      full_name: 'System Administrator',
      name: 'System Administrator',
      email: 'admin@physiofi.com',
      phone: '+91 9998103191',
      password: 'admin123',  // plain; Admin model hashes it on save
      role: 'superadmin',
      department: 'Operations',
      status: 'Active',
      isVerified: true
    });

    await admin.save();
    console.log('✅ Default admin created successfully');
    console.log('📧 Email: admin@physiofi.com');
    console.log('🔑 Password: admin123');
    console.log('   (Change password after first login. Admin login: /admin/login)');
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
    throw error;
  }
};

// Main setup function
const setup = async () => {
  try {
    console.log('🚀 Starting PhysioFi database setup...\n');
    
    // Connect to database
    await connectDB();
    
    // Create default admin
    await createDefaultAdmin();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n🔗 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup, connectDB, createDefaultAdmin };