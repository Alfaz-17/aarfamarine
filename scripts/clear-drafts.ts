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

async function clearDrafts() {
  console.log('Clearing old drafts...')
  await client.delete({ query: '*[_id in path("drafts.**")]' })
  console.log('Drafts cleared!')
}

clearDrafts()
