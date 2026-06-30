import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      // Aggressive edge caching (cache for 60s, serve stale for up to 5 mins while revalidating)
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
      
      const { category, featured, search, limit } = req.query
      const filter: any = {}
      if (category) filter.category = category
      if (featured === 'true') filter.featured = true
      if (search) {
        // Optimized text search instead of slow regex
        filter.$text = { $search: search as string }
      }
      const products = await Product.find(filter)
        .populate('category', 'name')
        .populate('brand', 'name image')
        .sort({ createdAt: -1 })
        .limit(limit ? parseInt(limit as string) : 100)
        .lean()
      return res.status(200).json(products)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch products' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const product = await Product.create(req.body)
      return res.status(201).json(product)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create product' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
