import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/db'
import { Category } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid category id' })
  }

  if (req.method === 'GET') {
    try {
      const category = await Category.findById(id).lean()
      if (!category) return res.status(404).json({ error: 'Category not found' })
      return res.status(200).json(category)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch category' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const category = await Category.findByIdAndUpdate(id, req.body, { new: true })
      if (!category) return res.status(404).json({ error: 'Category not found' })
      return res.status(200).json(category)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update category' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const category = await Category.findByIdAndDelete(id)
      if (!category) return res.status(404).json({ error: 'Category not found' })
      return res.status(200).json({ message: 'Category deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete category' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
