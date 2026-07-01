import { NextApiRequest, NextApiResponse } from "next";
import { analyzeProductImage } from "@/lib/gemini";

// Increase body size limit for base64 image strings
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, categories } = req.body;

    let base64Data = imageBase64;
    let mime = mimeType || "image/jpeg";
    
    if (imageBase64.startsWith("data:")) {
      const parts = imageBase64.split(",");
      base64Data = parts[1];
      mime = parts[0].split(";")[0].split(":")[1];
    }

    if (!base64Data) {
      return res.status(400).json({ error: "No image data provided" });
    }

    const analysis = await analyzeProductImage(base64Data, mime, categories || []);

    return res.status(200).json(analysis);
  } catch (error: any) {
    console.error("AI Analysis Error Detail:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to analyze image",
      detail: error.stack || "No stack trace",
      env: process.env.GEMINI_API_KEY ? "PRESENT" : "MISSING"
    });
  }
}
