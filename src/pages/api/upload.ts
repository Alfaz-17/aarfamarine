import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit for base64 images
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, folder = 'aarfa-marine' } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary credentials missing in .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate signature: sha1(folder=...&timestamp=... + api_secret)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', fileBase64);
    formData.append('folder', folder);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await cloudinaryRes.json();

    if (cloudinaryRes.ok) {
      return res.status(200).json({ secure_url: data.secure_url });
    } else {
      console.error('Cloudinary API Error:', data);
      return res.status(500).json({ error: data.error?.message || 'Failed to upload to Cloudinary' });
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Internal server error during upload' });
  }
}
