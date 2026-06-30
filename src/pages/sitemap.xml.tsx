import { GetServerSideProps } from 'next'
import connectToDatabase from '@/lib/db'
import { Product, Category, Brand } from '@/lib/models'

const EXTERNAL_DATA_URL = 'https://aarfamarine.com'

function generateSiteMap(products: any[], categories: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/products</loc>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/contact</loc>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/services</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     
     ${categories
       .map(({ _id, name }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/products?category=${encodeURIComponent(name || _id)}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.88</priority>
       </url>
     `
       })
       .join('')}

      ${products
        .map(({ _id, slug }) => {
          const urlIdentifier = slug || _id
          return `
        <url>
            <loc>${EXTERNAL_DATA_URL}/products/${urlIdentifier}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.85</priority>
        </url>
      `
        })
        .join('')}
    </urlset>
  `
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await connectToDatabase()
    
    // Fetch data for dynamic routes
    const products = await Product.find({}, '_id slug').lean()
    const categories = await Category.find({}, '_id name').lean()

    // We generate the XML sitemap with the data
    const sitemap = generateSiteMap(products, categories)

    res.setHeader('Content-Type', 'text/xml')
    // we send the XML to the browser
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
