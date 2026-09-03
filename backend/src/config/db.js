const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dementia-wellness';

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

module.exports = connectDatabase;
