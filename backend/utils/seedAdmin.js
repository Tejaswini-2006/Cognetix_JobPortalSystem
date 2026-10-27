const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect_db';
    await mongoose.connect(mongoUri);
    console.log(`[Seed Admin] Connected to MongoDB: ${mongoUri}`);

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@careerconnect.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Platform Administrator';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`[Seed Admin] Administrator account already exists for ${adminEmail}. No changes made.`);
      process.exit(0);
    }

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '+1 800-555-0199',
      title: 'Head of Operations',
      company: 'CareerConnect Portal',
    });

    console.log(`=======================================================`);
    console.log(`[Seed Admin] Administrator account initialized successfully!`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Role:     ${admin.role}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Note: Change this password immediately upon initial login.`);
    console.log(`=======================================================`);

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Admin Error]: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
