import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()

// Connect to Sanity
const client = createClient({
  projectId: 'tzblc51g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function seed() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN in .env file.')
    console.error('Please generate an API token with "Editor" permissions from https://manage.sanity.io/projects/tzblc51g/api and add it to your .env file as SANITY_API_TOKEN=your_token_here')
    process.exit(1)
  }

  console.log('🌱 Seeding Sanity database...')

  try {
    // 1. Seed Site Settings
    console.log('Seeding Site Settings...')
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      headOfficeAddress: 'Navapara Prime, Shop No. 28\nHaluria Chowk to Navapara Road\nBhavnagar 364001, Gujarat, India',
      branchOfficeAddress: 'Alang Shipbreaking Yard,\nBhavnagar, Gujarat, India',
      tel1: '+91 9081811248',
      tel2: '+91 8160002323',
      email1: 'sales@aarfamarine.com',
      email2: 'aarfamarine@gmail.com',
    })

    // 2. Seed Home Page
    console.log('Seeding Home Page...')
    await client.createOrReplace({
      _id: 'homePage',
      _type: 'homePage',
      heroHeadline: 'Marine Navigation &\nCommunication\nSystems',
      heroSubtitle: 'Trader, distributor, and service provider for reconditioned marine electronics, navigation aids, and automation equipment.',
      heroStats: [
        { _key: 'stat1', value: '9+', label: 'Years Experience' },
        { _key: 'stat2', value: '20+', label: 'Product Categories' },
        { _key: 'stat3', value: '100%', label: 'Global Export' },
      ],
      whatWeDoHeadline: 'Our Three Core Solutions',
      whatWeDoServices: [
        {
          _key: 'serv1',
          title: 'Supply of Marine Equipment',
          description: 'We supply a wide range of marine electronics — Navigation, Automation, and Communication equipment — sourced from trusted brands and the Alang Shipbreaking Yard.',
        },
        {
          _key: 'serv2',
          title: 'Installation & Commissioning',
          description: 'Our trained engineers visit the vessel and handle complete installation and testing of all equipment. We have hands-on experience with Radar, ECDIS, AIS, Autopilot, GPS, VDR, Speed Log, Satellite Compass, NAVTEX, BNWAS, Echo Sounder, and more.',
        },
        {
          _key: 'serv3',
          title: 'After-Sales Service & Technical Support',
          description: 'We don\'t disappear after the sale. Our team provides ongoing technical support, troubleshooting, and service — and we keep engineers trained and current with the latest product updates and IMO requirements.',
        },
      ],
      keyFacts: [
        { _key: 'kf1', value: '9+', label: 'Years of Marine Electronics Expertise' },
        { _key: 'kf2', value: '500+', label: 'Vessels Equipped & Successfully Serviced' },
        { _key: 'kf3', value: '24hr', label: 'Rapid Spares Delivery Worldwide' },
      ],
    })

    // 3. Seed Team Members
    console.log('Clearing old Team Members...')
    await client.delete({query: '*[_type == "teamMember"]'})

    console.log('Seeding Team Members...')
    const defaultTeam = [
      {
        name: 'Afjal Sarvaiya',
        role: 'Managing Director',
        description: 'Leading the vision and strategy for global maritime supply and services at Aarfa Marine.',
        phone: '+91 8160002323',
        isFounder: true,
      },
      {
        name: 'Fejal Gundigara',
        role: 'Operations Manager',
        description: 'Overseeing day-to-day operations, ensuring seamless global dispatch and logistics efficiency.',
        phone: '+91 8347471248',
        isFounder: false,
      },
      {
        name: 'Javed Deraiya',
        role: 'Service Engineer Manager',
        description: 'Managing technical teams, installations, and critical on-board equipment commissioning.',
        phone: '+91 8306161422',
        isFounder: false,
      },
      {
        name: 'Sahil Sarmali',
        role: 'Finance & Account Manager',
        description: 'Directing financial planning, accounting compliance, and corporate financial health.',
        phone: '+91 9081811248',
        isFounder: false,
      }
    ]

    for (let i = 0; i < defaultTeam.length; i++) {
      const member = defaultTeam[i]
      await client.create({
        _type: 'teamMember',
        name: member.name,
        role: member.role,
        description: member.description,
        phone: member.phone,
        order: i + 1,
      })
    }

    console.log('✅ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

seed()
