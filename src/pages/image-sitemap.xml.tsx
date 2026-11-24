import { GetServerSideProps } from 'next'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'

const EXTERNAL_DATA_URL = 'https://aarfamarine.com'

function escapeXml(unsafe: string) {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateImageSiteMap(products: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${products
       .map((product) => {
         const urlIdentifier = product.slug || product._id
         const rawImages = [product.image, ...(product.images || [])]
           .filter(Boolean)
           .filter((val, idx, arr) => arr.indexOf(val) === idx)

         if (rawImages.length === 0) return ''

         const cleanTitle = escapeXml(product.title)
         const brandName = typeof product.brand === 'object' ? product.brand?.name : product.brand
         const cleanBrand = escapeXml(brandName || '')
         const cleanCaption = escapeXml(`Reconditioned ${product.title} sourced from Alang Shipyard`)

         const imageXmlEntries = rawImages
           .map((img: string) => {
             const loc = img.startsWith('http') ? img : `${EXTERNAL_DATA_URL}${img}`
             return `
            <image:image>
                <image:loc>${escapeXml(loc)}</image:loc>
                <image:title>${cleanTitle}${cleanBrand ? ` by ${cleanBrand}` : ''} | Marine Spare Parts</image:title>
                <image:caption>${cleanCaption}</image:caption>
                <image:geo_location>Alang, Gujarat, India</image:geo_location>
            </image:image>`
           })
           .join('')

         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/products/${urlIdentifier}</loc>${imageXmlEntries}
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export default function ImageSiteMap() {
  // getServerSideProps handles rendering the XML response
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await connectToDatabase()
    
    // Fetch products with images, slug, title, and brand
    const products = await Product.find({}, '_id slug image images title brand category').lean()

    const sitemap = generateImageSiteMap(products)

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600') // Cache at CDN for 24h
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
