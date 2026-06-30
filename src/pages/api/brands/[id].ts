import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
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
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid brand id' })
  }

  if (req.method === 'GET') {
    try {
      const brand = await Brand.findById(id).lean()
      if (!brand) return res.status(404).json({ error: 'Brand not found' })
      return res.status(200).json(brand)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch brand' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const brand = await Brand.findByIdAndUpdate(id, normalizeBrandPayload(req.body), { new: true })
      if (!brand) return res.status(404).json({ error: 'Brand not found' })
      return res.status(200).json(brand)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update brand' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const brand = await Brand.findByIdAndDelete(id)
      if (!brand) return res.status(404).json({ error: 'Brand not found' })
      return res.status(200).json({ message: 'Brand deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete brand' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
