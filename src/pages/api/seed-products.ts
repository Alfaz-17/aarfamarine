import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Category, Brand, Product } from '@/lib/models'

/**
 * Seeds demo products across all main categories (Navigation, Communication, Automation).
 * Uses a single shared image for all products.
 * POST /api/seed-products
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    // Ensure categories exist
    const categoryMap: Record<string, any> = {}
    const categoriesToSeed = [
      // Navigation
      { name: 'Marine Radar', mainCategory: 'Navigation' },
      { name: 'GPS', mainCategory: 'Navigation' },
      { name: 'ECDIS', mainCategory: 'Navigation' },
      { name: 'Gyro Compass', mainCategory: 'Navigation' },
      { name: 'AIS', mainCategory: 'Navigation' },
      // Communication
      { name: 'GMDSS Radio', mainCategory: 'Communication' },
      { name: 'Satellite Communication', mainCategory: 'Communication' },
      { name: 'VHF Radio', mainCategory: 'Communication' },
      // Automation
      { name: 'Engine Alarm Monitoring System', mainCategory: 'Automation' },
      { name: 'Fire Alarm System', mainCategory: 'Automation' },
      { name: 'Tank Gauging System', mainCategory: 'Automation' },
    ]

    for (const cat of categoriesToSeed) {
      let existing = await Category.findOne({ name: cat.name })
      if (!existing) {
        existing = await Category.create({ ...cat, description: `${cat.name} equipment and spares` })
      }
      categoryMap[cat.name] = existing
    }

    // Ensure brands exist
    const brandMap: Record<string, any> = {}
    const brandsToSeed = [
      { name: 'Furuno', description: 'Japanese marine electronics manufacturer' },
      { name: 'JRC', description: 'Japan Radio Co. — navigation and communication' },
      { name: 'Kongsberg', description: 'Norwegian maritime technology' },
      { name: 'Raytheon Anschütz', description: 'German marine navigation systems' },
      { name: 'SAILOR', description: 'Danish maritime communication equipment' },
      { name: 'Kelvin Hughes', description: 'UK-based navigation radar manufacturer' },
    ]

    for (const brand of brandsToSeed) {
      let existing = await Brand.findOne({ name: brand.name })
      if (!existing) {
        existing = await Brand.create(brand)
      }
      brandMap[brand.name] = existing
    }

    // Demo product image (shared across all seeded products)
    const DEMO_IMAGE = '/images/marine-radio.jpg'

    // ── Products to seed ──
    const demoProducts = [
      // ─── Navigation (5 products) ───
      {
        title: 'Furuno FAR-2228 Marine Radar',
        slug: 'furuno-far-2228-radar',
        description: 'The FAR-2228 is a 25kW X-Band marine radar with 19" color LCD display. Features include Fast Target Tracking (TT), AIS interface, and chart overlay capability. Ideal for merchant vessels and large fishing boats.',
        category: categoryMap['Marine Radar']?._id,
        brand: brandMap['Furuno']?._id,
        brandName: 'Furuno',
        price: 3500,
        availability: 'in-stock' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['radar', 'furuno', 'marine radar', 'x-band'],
      },
      {
        title: 'JRC JMR-7230 Marine Radar',
        slug: 'jrc-jmr-7230-radar',
        description: '10.4" color LCD radar with 25kW output. ARPA-equipped with up to 100 target tracking. Compact design suitable for coastal and ocean-going vessels.',
        category: categoryMap['Marine Radar']?._id,
        brand: brandMap['JRC']?._id,
        brandName: 'JRC',
        price: 2800,
        availability: 'in-stock' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['radar', 'jrc', 'arpa', 'navigation'],
      },
      {
        title: 'Furuno GP-170 GPS Navigator',
        slug: 'furuno-gp-170-gps',
        description: 'DGPS/GPS navigator for professional maritime use. Features WAAS/EGNOS augmentation, NMEA 0183 output, and 4.5" monochrome LCD. IMO compliant.',
        category: categoryMap['GPS']?._id,
        brand: brandMap['Furuno']?._id,
        brandName: 'Furuno',
        price: 1200,
        availability: 'in-stock' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['gps', 'furuno', 'dgps', 'navigator'],
      },
      {
        title: 'Kelvin Hughes ECDIS MantaDigital',
        slug: 'kelvin-hughes-ecdis-manta',
        description: 'Type-approved ECDIS system with dual-station capability, S-57 and S-63 chart support, route planning, and automatic chart updates. 24" widescreen display.',
        category: categoryMap['ECDIS']?._id,
        brand: brandMap['Kelvin Hughes']?._id,
        brandName: 'Kelvin Hughes',
        price: 6500,
        availability: 'on-demand' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['ecdis', 'electronic chart', 'kelvin hughes', 'navigation'],
      },
      {
        title: 'Raytheon Anschütz Standard 22 Gyro Compass',
        slug: 'raytheon-standard-22-gyro',
        description: 'IMO-compliant gyro compass with high accuracy (±0.1° secant latitude). Self-aligning, maintenance-free operation. Suitable for all vessel types.',
        category: categoryMap['Gyro Compass']?._id,
        brand: brandMap['Raytheon Anschütz']?._id,
        brandName: 'Raytheon Anschütz',
        price: 8000,
        availability: 'in-stock' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['gyro compass', 'raytheon', 'navigation', 'compass'],
      },

      // ─── Communication (3 products) ───
      {
        title: 'SAILOR 6310 MF/HF GMDSS Radio',
        slug: 'sailor-6310-gmdss',
        description: '150W MF/HF radiotelephone with DSC. Full GMDSS compliance for Sea Area A3/A4. Built-in DSC watch receiver and NBDP terminal capability.',
        category: categoryMap['GMDSS Radio']?._id,
        brand: brandMap['SAILOR']?._id,
        brandName: 'SAILOR',
        price: 4200,
        availability: 'in-stock' as const,
        featured: true,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['gmdss', 'sailor', 'mf/hf', 'radio', 'communication'],
      },
      {
        title: 'JRC JSS-2150 GMDSS Communication System',
        slug: 'jrc-jss-2150-gmdss',
        description: 'Integrated MF/HF communication system with 150W output. Features DSC, radio telephony, and NBDP. Compact console design with full GMDSS functionality.',
        category: categoryMap['GMDSS Radio']?._id,
        brand: brandMap['JRC']?._id,
        brandName: 'JRC',
        price: 3800,
        availability: 'in-stock' as const,
        featured: false,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['gmdss', 'jrc', 'communication', 'mf/hf'],
      },
      {
        title: 'Furuno FELCOM-18 Inmarsat-C Station',
        slug: 'furuno-felcom-18-satcom',
        description: 'Inmarsat-C satellite communication terminal for GMDSS. Supports distress alerting, EGC, and data messaging. Compact above-deck unit.',
        category: categoryMap['Satellite Communication']?._id,
        brand: brandMap['Furuno']?._id,
        brandName: 'Furuno',
        price: 2900,
        availability: 'on-demand' as const,
        featured: false,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['inmarsat', 'satellite', 'furuno', 'communication'],
      },

      // ─── Automation (3 products) ───
      {
        title: 'Kongsberg K-Chief 600 Alarm System',
        slug: 'kongsberg-kchief-600',
        description: 'Integrated alarm, monitoring, and control system for engine room automation. Supports up to 2000 I/O points. DNV-GL type approved.',
        category: categoryMap['Engine Alarm Monitoring System']?._id,
        brand: brandMap['Kongsberg']?._id,
        brandName: 'Kongsberg',
        price: 12000,
        availability: 'on-demand' as const,
        featured: false,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['alarm', 'monitoring', 'kongsberg', 'automation', 'engine room'],
      },
      {
        title: 'JRC JAX-9A Fire Alarm System',
        slug: 'jrc-jax-9a-fire-alarm',
        description: 'Addressable fire detection and alarm system for marine applications. Supports smoke, heat, and flame detectors. SOLAS compliant with zone mapping.',
        category: categoryMap['Fire Alarm System']?._id,
        brand: brandMap['JRC']?._id,
        brandName: 'JRC',
        price: 5500,
        availability: 'in-stock' as const,
        featured: false,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['fire alarm', 'jrc', 'safety', 'automation'],
      },
      {
        title: 'Kongsberg GL-200 Tank Gauging System',
        slug: 'kongsberg-gl-200-tank',
        description: 'Radar-based tank level gauging system for cargo and ballast monitoring. High accuracy measurement for crude oil, LNG, and chemicals.',
        category: categoryMap['Tank Gauging System']?._id,
        brand: brandMap['Kongsberg']?._id,
        brandName: 'Kongsberg',
        price: 9800,
        availability: 'on-demand' as const,
        featured: false,
        image: DEMO_IMAGE,
        images: [DEMO_IMAGE],
        keywords: ['tank gauging', 'kongsberg', 'cargo', 'automation'],
      },
    ]

    let seeded = 0
    for (const product of demoProducts) {
      const exists = await Product.findOne({ slug: product.slug })
      if (!exists) {
        await Product.create(product)
        seeded++
      }
    }

    const totalProducts = await Product.countDocuments()
    const totalCategories = await Category.countDocuments()

    return res.status(200).json({
      message: `Seeding complete. ${seeded} new products added.`,
      stats: {
        newProducts: seeded,
        totalProducts,
        totalCategories,
        skipped: demoProducts.length - seeded,
      }
    })
  } catch (error) {
    console.error('Seed products error:', error)
    return res.status(500).json({ error: 'Failed to seed products' })
  }
}
