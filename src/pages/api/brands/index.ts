import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Brand } from '@/lib/models'
import { getSession } from '@/lib/auth'

const normalizeBrandPayload = (body: any) => {
  const payload = { ...body }
  if (!payload.image && payload.logo) payload.image = payload.logo
  delete payload.logo
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const brands = await Brand.find().sort({ name: 1 }).lean()
      return res.status(200).json(brands)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch brands' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const brand = await Brand.create(normalizeBrandPayload(req.body))
      return res.status(201).json(brand)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create brand' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
