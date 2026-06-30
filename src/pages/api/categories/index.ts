import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Category } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const categories = await Category.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(categories)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const category = await Category.create(req.body)
      return res.status(201).json(category)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create category' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
