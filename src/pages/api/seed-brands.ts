import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Brand } from '@/lib/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    const brandsToInsert = [
      { name: 'COBHAM', image: '/brands/COBHAM.png' },
      { name: 'KODEN', image: '/brands/KODEN.png' },
      { name: 'Thrane & Thrane', image: '/brands/Thrane-Thrane.jpg.jpeg' },
      { name: 'FURUNO', image: '/brands/furuno.jpg.jpeg' },
    ]

    await Brand.deleteMany({}) // Clear existing brands
    const newBrands = await Brand.insertMany(brandsToInsert)

    res.status(200).json({ success: true, message: 'Brands seeded successfully', brands: newBrands })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
