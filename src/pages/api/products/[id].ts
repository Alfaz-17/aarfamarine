import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product id' })
  }

  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id)
        .populate('category', 'name')
        .populate('brand', 'name image')
        .lean()
      if (!product) return res.status(404).json({ error: 'Product not found' })
      return res.status(200).json(product)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch product' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
      if (!product) return res.status(404).json({ error: 'Product not found' })
      return res.status(200).json(product)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update product' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const product = await Product.findByIdAndDelete(id)
      if (!product) return res.status(404).json({ error: 'Product not found' })
      return res.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete product' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
