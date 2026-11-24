import React from 'react'

export function GlobalStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aarfa Marine",
    "url": "https://aarfamarine.com",
    "logo": "https://aarfamarine.com/images/logo.png",
    "foundingDate": "2013",
    "description": "Trader, distributor, and service provider for reconditioned marine electronics, navigation aids, and automation equipment.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9925232986",
        "contactType": "sales",
        "areaServed": "Worldwide"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No 3, First Floor, Block A, Alang House",
      "addressLocality": "Bhavnagar",
      "addressRegion": "Gujarat",
      "postalCode": "364001",
      "addressCountry": "IN"
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "name": "Aarfa Marine",
    "image": "https://aarfamarine.com/images/logo.png",
    "telephone": "+91-9925232986",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No 3, First Floor, Block A, Alang House",
      "addressLocality": "Bhavnagar",
      "addressRegion": "Gujarat",
      "postalCode": "364001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.7645,
      "longitude": 72.1416
    },
    "paymentAccepted": ["Cash", "Bank Transfer", "Wire Transfer"],
    "currenciesAccepted": "USD, INR, EUR",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aarfa Marine",
    "url": "https://aarfamarine.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://aarfamarine.com/products?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

export function ProductStructuredData({ product }: { product: any }) {
  if (!product) return null

  const baseUrl = 'https://aarfamarine.com'
  const productUrl = `${baseUrl}/products/${product.slug || product._id}`
  const mainImage = product.image || (product.images && product.images[0]) || '/images/marine-bridge.jpg'
  const mainImageUrl = mainImage.startsWith('http') ? mainImage : `${baseUrl}${mainImage}`

  const allImages = [
    mainImageUrl,
    ...(product.images || [])
      .map((img: string) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
  ].filter((v, i, a) => a.indexOf(v) === i)

  const brandName = product.brand?.name || product.brandName || 'Marine Equipment'
  const categoryName = product.category?.name || product.categoryName || 'Marine Spare Parts'

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": allImages,
    "description": product.metaDescription || product.description || `Reconditioned ${product.title} marine spare part sourced from Alang Shipyard, Bhavnagar, Gujarat, India.`,
    "sku": product.sku || product._id?.toString(),
    "mpn": product.model || product.sku || product._id?.toString(),
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    "category": categoryName,
    "itemCondition": "https://schema.org/RefurbishedCondition",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "USD",
      "price": "0",
      "priceValidUntil": "2027-12-31",
      "availability": product.availability === 'out-of-stock' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/RefurbishedCondition",
      "seller": {
        "@type": "Organization",
        "name": "Aarfa Marine",
        "url": baseUrl
      }
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${baseUrl}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `${baseUrl}/products?category=${encodeURIComponent(categoryName)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": productUrl
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
