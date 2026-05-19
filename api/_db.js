import mongoose from 'mongoose';

// Use environment variable if available, otherwise fallback to the hardcoded URL to ensure Vercel always connects
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://pkv07b_db_user:B9POq9UoH9dD6jjQ@pravin.ljvsevp.mongodb.net/healhabit?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  console.warn('⚠️ No MONGODB_URI found. Database connections will fail.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and prevent connection exhaustion in serverless environments.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('🛡️ [HealHabit Serverless] Connected to MongoDB Atlas!');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  theme: { type: String, default: 'dark' },
  water: { type: Number, default: 0 },
  screenTime: {
    total: { type: Number, default: 252 },
    categories: {
      entertainment: { type: Number, default: 120 },
      news: { type: Number, default: 60 },
      coding: { type: Number, default: 72 },
      focus: { type: Number, default: 0 },
      custom: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  },
  sleepDuration: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0 },
  history: { type: Array, default: [] },
  lastActiveDate: { type: String, default: '' }
});

// Avoid OverwriteModelError in Serverless Environments
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { connectToDatabase, User };
