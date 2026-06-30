import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import { User } from '@/lib/models';
import { getSession } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    await connectToDatabase();
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (session.userId === 'admin') {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (currentPassword !== adminPassword) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
      
      let user = await User.findOne({ email: session.email });
      if (!user) {
        user = new User({
          name: 'System Admin',
          email: session.email,
          password: hashedPassword
        });
      } else {
        user.password = hashedPassword;
      }
      await user.save();
    } else {
      const user = await User.findById(session.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }

      user.password = hashedPassword;
      await user.save();
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
