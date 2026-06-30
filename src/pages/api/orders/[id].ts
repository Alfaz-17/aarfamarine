import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/db'
import { Order } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order id' })
  }

  if (req.method === 'GET') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const order = await Order.findById(id).lean()
      if (!order) return res.status(404).json({ error: 'Order not found' })
      return res.status(200).json(order)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch order' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
      if (!order) return res.status(404).json({ error: 'Order not found' })
      return res.status(200).json(order)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update order' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const order = await Order.findByIdAndDelete(id)
      if (!order) return res.status(404).json({ error: 'Order not found' })
      return res.status(200).json({ message: 'Order deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete order' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
