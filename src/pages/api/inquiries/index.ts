import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Inquiry } from '@/lib/models'
import { getSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()

    if (req.method === 'POST') {
      const { name, email, phone, company, message, source } = req.body

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' })
      }

      const newInquiry = new Inquiry({
        name,
        email,
        phone,
        company,
        message,
        source: source || 'Website',
      })

      await newInquiry.save()
      return res.status(201).json(newInquiry)
    }

    if (req.method === 'GET') {
      // Basic auth check for admin panel
      const session = await getSession(req)
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const inquiries = await Inquiry.find({}).sort({ createdAt: -1 })
      return res.status(200).json(inquiries)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Inquiries API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
