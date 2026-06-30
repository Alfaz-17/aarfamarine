import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { GalleryImage } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const { category } = req.query
      const filter = category && category !== 'all' ? { category } : {}
      const images = await GalleryImage.find(filter).sort({ createdAt: -1 }).lean()
      return res.status(200).json(images)
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
      return res.status(500).json({ error: 'Failed to fetch gallery images' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const { url, title, category } = req.body
      if (!url) return res.status(400).json({ error: 'Image URL is required' })

      const newImage = await GalleryImage.create({ url, title, category: category || 'other' })
      return res.status(201).json(newImage)
    } catch (error) {
      console.error('Failed to save gallery image:', error)
      return res.status(500).json({ error: 'Failed to save gallery image' })
    }
  }
  
  if (req.method === 'DELETE') {
    try {
      const session = await getSession(req)
      if (!session) return res.status(401).json({ error: 'Unauthorized' })

      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Image ID is required' })
      
      await GalleryImage.findByIdAndDelete(id)
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to delete gallery image:', error)
      return res.status(500).json({ error: 'Failed to delete gallery image' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
