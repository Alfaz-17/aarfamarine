import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/db';
import { Settings } from '@/lib/models';
import { getSession } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({
          autoBackgroundRemoval: false,
          applyWatermark: true,
          watermarkText: 'Aarfa Marine Solutions'
        });
      }
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Settings GET error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      let settings = await Settings.findOne();
      if (settings) {
        settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
      } else {
        settings = await Settings.create(req.body);
      }
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Settings POST error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
