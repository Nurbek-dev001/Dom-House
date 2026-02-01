import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const app = express();

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  console.log('[TEST] Request received');
  res.json({ success: true });
});

// MongoDB connection
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/domhouse');
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB error:', err.message);
}

app.listen(5000, '127.0.0.1', () => {
  console.log('Test server on port 5000 at 127.0.0.1');
});
