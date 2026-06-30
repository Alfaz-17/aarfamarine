import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
}

const siteMetadata = {
  title: 'Aarfa Marine',
  titleTemplate: '%s | Aarfa Marine',
  defaultTitle: 'Aarfa Marine | Marine Spare Parts & Marine Services Supplier',
  description: 'Supplier of high-quality marine spare parts, automation systems, electronics, and reconditioned equipment sourced from Alang Shipyard. Global export available.',
  siteUrl: 'https://aarfamarine.com', // Replace with actual domain when live
  defaultImage: '/aarfa-logo.png',
  twitterHandle: '@aarfamarine',
  defaultKeywords: ['marine spare parts', 'Alang shipyard', 'ship parts', 'marine automation', 'marine electronics', 'ship engine parts', 'marine equipment supplier'],
}

export function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex = false,
}: SEOProps) {
  const router = useRouter()
  
  const seoTitle = title ? siteMetadata.titleTemplate.replace('%s', title) : siteMetadata.defaultTitle
  const seoDescription = description || siteMetadata.description
  const seoUrl = canonicalUrl ? `${siteMetadata.siteUrl}${canonicalUrl}` : `${siteMetadata.siteUrl}${router.asPath === '/' ? '' : router.asPath}`
  const seoImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${siteMetadata.siteUrl}${ogImage}`) : `${siteMetadata.siteUrl}${siteMetadata.defaultImage}`
  const seoKeywords = keywords ? [...keywords, ...siteMetadata.defaultKeywords].join(', ') : siteMetadata.defaultKeywords.join(', ')

  return (
    <Head>
      {/* Basic Metadata */}
      <title key="title">{seoTitle}</title>
      <meta key="description" name="description" content={seoDescription} />
      <meta key="keywords" name="keywords" content={seoKeywords} />
      <meta key="author" name="author" content={siteMetadata.title} />

      {/* Canonical URL */}
      <link key="canonical" rel="canonical" href={seoUrl} />

      {/* Robots Control */}
      {noindex ? (
        <meta key="robots" name="robots" content="noindex, nofollow" />
      ) : (
        <meta key="robots" name="robots" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      )}

      {/* OpenGraph Metadata (Facebook, LinkedIn, etc) */}
      <meta key="og:site_name" property="og:site_name" content={siteMetadata.title} />
      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:title" property="og:title" content={seoTitle} />
      <meta key="og:description" property="og:description" content={seoDescription} />
      <meta key="og:url" property="og:url" content={seoUrl} />
      <meta key="og:image" property="og:image" content={seoImage} />
      <meta key="og:locale" property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:site" name="twitter:site" content={siteMetadata.twitterHandle} />
      <meta key="twitter:creator" name="twitter:creator" content={siteMetadata.twitterHandle} />
      <meta key="twitter:title" name="twitter:title" content={seoTitle} />
      <meta key="twitter:description" name="twitter:description" content={seoDescription} />
      <meta key="twitter:image" name="twitter:image" content={seoImage} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={seoTitle} />

      {/* PWA / App */}
      <meta key="theme-color" name="theme-color" content="#0E2A47" />
    </Head>
  )
}
