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
      const updatedUserData = req.body;
      
      const user = await User.findOneAndUpdate(
        { email: updatedUserData.email },
        updatedUserData,
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        user
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
