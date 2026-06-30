import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import https from 'https';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const makeCloudinaryRequest = (cloudName: string, payload: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: { error: { message: `Invalid JSON from Cloudinary: ${data.substring(0, 100)}` } } });
        }
      });
    });
    
    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Server configuration error: Missing Cloudinary credentials' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const payload = JSON.stringify({
      file: fileBase64,
      folder,
      timestamp,
      api_key: apiKey,
      signature
    });

    const response = await makeCloudinaryRequest(cloudName, payload);

    if (response.status === 200) {
      return res.status(200).json({ secure_url: response.data.secure_url });
    } else {
      return res.status(500).json({ error: response.data.error?.message || `Failed to upload to Cloudinary: ${JSON.stringify(response.data)}` });
    }
  } catch (error: any) {
    return res.status(500).json({ error: `Upload exception: ${error.message}` });
  }
}
