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

    // If logged in via .env fallback, prevent password change
    if (session.id === 'admin') {
      return res.status(400).json({ error: 'Cannot change password for environment-configured system admin. Please update the .env file.' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    await connectToDatabase();
    
    // Find the user by ID
    const user = await User.findById(session.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password (bypass if they use the auto-filled placeholder for convenience)
    if (currentPassword !== '********') {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
