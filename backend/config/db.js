const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error(`Ensure your MongoDB server is running (e.g., net start MongoDB or mongod) or check your MONGODB_URI in backend/.env`);
    process.exit(1);
  }
};

module.exports = connectDB;
