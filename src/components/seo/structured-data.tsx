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
