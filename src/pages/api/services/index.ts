import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Service } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const services = await Service.find().sort({ createdAt: -1 }).lean()
      return res.status(200).json(services)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch services' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const service = await Service.create(req.body)
      return res.status(201).json(service)
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to create service' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
