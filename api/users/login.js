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
      const { email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      
      if (existingUser && existingUser.password === password) {
        return res.status(200).json({
          success: true,
          user: existingUser
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
