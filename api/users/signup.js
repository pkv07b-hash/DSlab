import { connectToDatabase, User } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const userData = req.body;
      
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      
      const newUser = new User(userData);
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: 'User registered in MongoDB Atlas!',
        user: newUser
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
