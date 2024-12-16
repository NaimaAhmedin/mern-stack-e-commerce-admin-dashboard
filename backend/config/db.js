const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Connection URI:', process.env.MONGO_URI);
    
    // Additional network diagnostics
    const { networkInterfaces } = require('os');
    const interfaces = networkInterfaces();
    console.log('Network Interfaces:', interfaces);
    
    process.exit(1);
  }
};

module.exports = connectDB;
