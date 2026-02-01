import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: './.env.local' });

const connectdb = async () => {
  try {
    // Determine MongoDB URI from environment or fallback to config
    const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/domhouse';

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for better stability
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Retry connection instead of exiting
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(() => connectdb(), 5000);
  }
};

export default connectdb;