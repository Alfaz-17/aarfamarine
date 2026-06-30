import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Order } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const { status } = req.query
      const filter: any = {}
      if (status) filter.status = status
      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean()
      return res.status(200).json(orders)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch orders' })
    }
  }

  if (req.method === 'POST') {
    try {
      const order = await Order.create(req.body)
      return res.status(201).json(order)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create order' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
