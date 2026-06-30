import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/db';
import { Product, Category, Brand, Order } from '@/lib/models';
import { getSession } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectToDatabase();
    
    const [productCount, categoryCount, brandCount, orderCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      products: productCount,
      categories: categoryCount,
      brands: brandCount,
      orders: orderCount
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
