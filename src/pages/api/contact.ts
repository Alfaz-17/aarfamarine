import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/db'
import { Order } from '@/lib/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    const { name, email, phone, company, message } = req.body

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' })
    }

    const order = await Order.create({
      customerName: name,
      customerEmail: email || '',
      customerPhone: phone,
      company: company || '',
      message: message || '',
      status: 'pending',
    })

    return res.status(201).json({ message: 'Inquiry submitted successfully', order })
  } catch (error) {
    console.error('Contact error:', error)
    return res.status(500).json({ error: 'Failed to submit inquiry' })
  }
}
