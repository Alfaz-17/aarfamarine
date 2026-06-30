import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Category, Brand, Settings, Product, Service, User } from '@/lib/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    // Seed default categories
    const defaultCategories = [
      // Navigation
      ...['Gyro Compass', 'Marine Radar', 'ECDIS', 'GPS', 'AIS', 'Autopilots', 'VDR & SVDR', 'Satellite Compass', 'Echo Sounders', 'Doppler Speed Log', 'NAVTEX', 'BNWAS', 'Magnetic Compass', 'Antenna', 'D-FAX', 'Printer', 'Magnetrons', 'ATU', 'Anemometer', 'Bearing Repeater', 'Hatteland Display'].map(name => ({
        name, mainCategory: 'Navigation', description: `${name} systems and parts`
      })),
      
      // Automation
      ...['Engine Alarm Monitoring System', 'Fire Alarm System', 'Engine Control Systems', 'Tank Gauging System', 'AVR & Generator Control', '15 PPM Monitors', 'OMD Oil Mist Detector', 'Boiler & Burner', 'Flow Meters', 'Temperature Controllers', 'Pressure Controllers', 'MCB & ACB', 'DP System', 'Governor & Controls', 'VTI Tabs'].map(name => ({
        name, mainCategory: 'Automation', description: `${name} automation solutions`
      })),
      
      // Communication
      { name: 'Navigation Spare Parts', mainCategory: 'Communication', description: 'All types, all brands, all models, available for immediate dispatch' }
    ]

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name })
      if (!exists) {
        await Category.create(cat)
      }
    }

    // Seed default brands
    const defaultBrands = [
      { name: 'Furuno', description: 'Japanese marine electronics manufacturer' },
      { name: 'JRC', description: 'Japan Radio Co.' },
      { name: 'Kongsberg', description: 'Norwegian marine technology company' },
      { name: 'Raytheon Anschütz', description: 'German marine navigation systems' },
    ]

    for (const brand of defaultBrands) {
      const exists = await Brand.findOne({ name: brand.name })
      if (!exists) {
        await Brand.create(brand)
      }
    }

    // Seed admin user
    const adminExists = await User.findOne({ email: 'admin@aarfamarine.com' })
    if (!adminExists) {
      await User.create({
        name: 'Aarfa Admin',
        email: 'admin@aarfamarine.com',
        password: 'password123', // Just a dummy password for the demo, should be hashed in real life
      })
    }

    // Seed Settings
    const settingsExists = await Settings.findOne()
    if (!settingsExists) {
      await Settings.create({
        siteName: 'Aarfa Marine',
        siteDescription: 'Marine & Industrial Suppliers',
        contactEmail: 'info@aarfamarine.com',
        contactPhone: '+91 9081811248',
        address: 'Bhavnagar, Gujarat, India',
      })
    }

    // Seed Products
    const radarCategory = await Category.findOne({ name: 'Marine Radar' })
    const furunoBrand = await Brand.findOne({ name: 'Furuno' })
    
    if (radarCategory && furunoBrand) {
      const productExists = await Product.findOne({ title: 'Furuno FAR-2117 Radar' })
      if (!productExists) {
        await Product.create({
          title: 'Furuno FAR-2117 Radar',
          description: 'The FAR-2117 marine radar provides advanced target tracking and unmatched reliability.',
          category: radarCategory._id,
          brand: furunoBrand._id,
          brandName: furunoBrand.name,
          price: 4500,
          availability: 'in-stock',
          featured: true,
          images: ['/images/products/radar.jpg']
        })
      }
    }

    return res.status(200).json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return res.status(500).json({ error: 'Failed to seed database' })
  }
}
