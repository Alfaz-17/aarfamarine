import React from 'react'

interface ProductSchemaProps {
  product: any
}

export function ProductSchema({ product }: ProductSchemaProps) {
  if (!product) return null

  // Ensure validity of price (must be positive)
  const price = product.price > 0 ? product.price : undefined

  // One year from now for Offer validity
  const validUntil = new Date()
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.image ? [product.image] : [],
    "description": product.description || `High-quality reconditioned ${product.title} sourced from Alang Shipyard.`,
    "sku": product._id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Marine Spare Parts"
    },
    "category": product.category?.name || "Marine Equipment",
    "offers": {
      "@type": "Offer",
      "url": `https://aarfamarine.com/product/${product._id}`,
      "priceCurrency": "USD",
      "price": price,
      "priceValidUntil": validUntil.toISOString().split('T')[0],
      "itemCondition": "https://schema.org/RefurbishedCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Aarfa Marine"
      }
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Where is this ${product.title} sourced from?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `This item is sourced directly from the Alang shipbreaking yard. It has been thoroughly inspected and reconditioned by our marine engineers.`
          }
        },
        {
          "@type": "Question",
          "name": "Do you ship internationally?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Aarfa Marine provides global export and shipping for all our marine electronics and automation equipment."
          }
        }
      ]
    }
  }

  // Remove undefined fields
  if (!schema.offers.price) {
    delete (schema.offers as any).price
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
