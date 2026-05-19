import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Database
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('🛡️  [HealHabit Database] Connected to MongoDB Atlas successfully!'))
    .catch(err => console.error('❌ [HealHabit Database] MongoDB connection error:', err));
} else {
  console.log('⚠️  No MONGODB_URI found in environment variables. Running in local simulated mode.');
}

// Define the User Schema and Model
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

const User = mongoose.model('User', UserSchema);

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET Route: Fetch all users
  if (req.url === '/api/users' && req.method === 'GET') {
    User.find()
      .then(users => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // POST Route: signup a new user in MongoDB Atlas
  if (req.url === '/api/users/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User already exists' }));
          return;
        }
        
        const newUser = new User(userData);
        await newUser.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'User registered in MongoDB Atlas!',
          user: newUser
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // POST Route: login user from MongoDB Atlas
  if (req.url === '/api/users/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        const existingUser = await User.findOne({ email });
        
        if (existingUser && existingUser.password === password) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            user: existingUser
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid credentials'
          }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // POST Route: update/sync user stats in MongoDB Atlas
  if (req.url === '/api/users/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const updatedUserData = JSON.parse(body);
        const user = await User.findOneAndUpdate(
          { email: updatedUserData.email },
          updatedUserData,
          { new: true }
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  if (req.url === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'HealHabit Backend State Server is running perfectly!',
      version: '1.0.0',
      database: 'Simulated Local Context Sync Enabled'
    }));
    return;
  }

  // Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const startServer = (port) => {
  server.listen(port, () => {
    console.log('===================================================');
    console.log(`🌿 [HealHabit Backend] Server is running on http://localhost:${port}`);
    console.log(`API Endpoint: http://localhost:${port}/api/status`);
    console.log('Press Ctrl+C to stop the backend server');
    console.log('===================================================');
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${PORT} is already in use by another program. trying port ${PORT + 1}...`);
    PORT++;
    startServer(PORT);
  } else {
    console.error(err);
  }
});

startServer(PORT);
