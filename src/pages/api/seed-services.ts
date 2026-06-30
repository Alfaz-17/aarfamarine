import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Service } from '@/lib/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    const equipments = [
      'Radar', 'AIS', 'ECDIS', 'Autopilot', 'GPS', 'VDR', 'Speed Log', 
      'Satellite Compass', 'NAVTEX', 'BNWAS', 'Echo Sounder', 
      'Magnetic Compass', 'Printer', 'Repeater'
    ]

    const images = ['/images/marine-radio.jpg', '/images/marine-bridge.jpg', '/images/home-hero.jpg', '/images/why-choose-us.jpg']

    const servicesToInsert = equipments.map((name, idx) => ({
      name,
      dec: `Professional installation, testing, and troubleshooting for ${name} systems to ensure reliable maritime operations.`,
      img: images[idx % images.length]
    }))

    await Service.deleteMany({}) 
    const newServices = await Service.insertMany(servicesToInsert)

    res.status(200).json({ success: true, message: 'Services seeded successfully', services: newServices })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
