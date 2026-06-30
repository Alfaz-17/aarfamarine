import React from 'react'
import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'
import { client } from '@/lib/sanity'

import { SEO } from '@/components/seo/SEO'

const DynamicHomeHero = dynamic(() => import('@/components/home/hero'))
const DynamicMainCategories = dynamic(() => import('@/components/home/main-categories'))
const DynamicStatsBand = dynamic(() => import('../components/home/stats'))
const DynamicAboutSection = dynamic(() => import('../components/home/about-section'))
const DynamicBrandsSection = dynamic(() => import('../components/home/brands-section'))
const DynamicKeyFacts = dynamic(() => import('../components/home/key-facts'))
const DynamicFeaturedProducts = dynamic(() => import('../components/home/featured-products'))
const DynamicWhatWeDo = dynamic(() => import('../components/home/what-we-do'))
const DynamicCustomerReviews = dynamic(() => import('../components/home/customer-reviews'))
const DynamicCtaBand = dynamic(() => import('../components/home/cta-band'))

interface HomeProps {
  featuredProducts: any[]
  brands: any[]
  homePageData: any
}

const Home: NextPageWithLayout<HomeProps> = ({ featuredProducts, brands, homePageData }) => {
  return (
    <>
      <SEO 
        title="Marine Navigation & Communication Systems" 
        description="Trader, distributor, and service provider for reconditioned marine electronics, navigation aids, and automation equipment from Alang Shipyard."
        canonicalUrl="/"
      />
      <DynamicHomeHero data={homePageData} />
      <DynamicMainCategories />
      <DynamicBrandsSection brands={brands} />
      <DynamicWhatWeDo data={homePageData} />
      <DynamicFeaturedProducts products={featuredProducts} />
      <DynamicStatsBand data={homePageData} />
      <DynamicCustomerReviews />
      <DynamicCtaBand />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    
    const [products, brands, homePageData] = await Promise.all([
      Product.find({}).populate('category').limit(6).lean(),
      import('@/lib/models').then(m => m.Brand.find({}).lean()),
      client.fetch(`*[_type == "homePage" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]`).catch(() => null)
    ])
    
    // Properly serialize Mongoose documents for Next.js props
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedBrands = JSON.parse(JSON.stringify(brands))

    return {
      props: {
        featuredProducts: serializedProducts,
        brands: serializedBrands,
        homePageData: homePageData || null,
      },
      revalidate: 60, // ISR: revalidate every 60 seconds
    }
  } catch (error) {
    console.error("Error fetching homepage data:", error)
    return {
      props: {
        featuredProducts: [],
        brands: [],
        homePageData: null,
      },
      revalidate: 60,
    }
  }
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default Home
