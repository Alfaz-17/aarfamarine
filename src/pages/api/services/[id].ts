import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/db'
import { Service } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid service id' })
  }

  if (req.method === 'GET') {
    try {
      const service = await Service.findById(id).lean()
      if (!service) return res.status(404).json({ error: 'Service not found' })
      return res.status(200).json(service)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch service' })
    }
  }

  // Protected routes
  const session = await getSession(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'PUT') {
    try {
      const service = await Service.findByIdAndUpdate(id, req.body, { new: true })
      if (!service) return res.status(404).json({ error: 'Service not found' })
      return res.status(200).json(service)
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to update service' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const service = await Service.findByIdAndDelete(id)
      if (!service) return res.status(404).json({ error: 'Service not found' })
      return res.status(200).json({ message: 'Service deleted successfully' })
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to delete service' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
