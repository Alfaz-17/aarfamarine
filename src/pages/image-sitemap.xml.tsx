import { GetServerSideProps } from 'next'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'

const EXTERNAL_DATA_URL = 'https://aarfamarine.com'

function generateImageSiteMap(products: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${products
       .filter((p) => p.image)
       .map(({ _id, image, title, brand, category }) => {
         const cleanTitle = title?.replace(/&/g, '&amp;') || ''
         const cleanBrand = brand?.replace(/&/g, '&amp;') || ''
         
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/product/${_id}</loc>
           <image:image>
               <image:loc>${image.startsWith('http') ? image : `${EXTERNAL_DATA_URL}${image}`}</image:loc>
               <image:title>${cleanTitle} ${cleanBrand ? `by ${cleanBrand}` : ''} | Marine Spare Parts</image:title>
               <image:caption>Reconditioned ${cleanTitle} sourced from Alang Shipyard</image:caption>
               <image:geo_location>Alang, Gujarat, India</image:geo_location>
           </image:image>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export default function ImageSiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await connectToDatabase()
    
    // Fetch products with images
    const products = await Product.find({}, '_id image title brand category').lean()

    const sitemap = generateImageSiteMap(products)

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600') // Cache for 1 hour
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end()
    return { props: {} }
  }
}
