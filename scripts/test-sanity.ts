import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
dotenv.config()

const client = createClient({
  projectId: 'tzblc51g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function check() {
  const docs = await client.fetch('*[_type == "homePage"]')
  console.log("Documents found:", docs.length)
  docs.forEach((d: any) => {
    console.log(`ID: ${d._id}`)
    console.log(`Headline: ${d.heroHeadline}`)
  })
}

check()
