import React from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import PageHero from '@/components/page-hero'
import ProductCard from '@/components/product-card'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'

interface NewArrivalsProps {
  products: any[]
}

const NewArrivals: NextPageWithLayout<NewArrivalsProps> = ({ products }) => {
  return (
    <>
      <Head>
        <title>New Arrivals | Aarfa Marine</title>
        <meta name="description" content="Check out the latest marine navigation and communication equipment arrivals at Aarfa Marine." />
      </Head>

      <PageHero 
        title="New Arrivals" 
        subtitle="The latest additions to our inventory, freshly sourced and rigorously tested for immediate deployment."
        image="/images/bridge-nav.jpg"
      />

      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default', minHeight: '60vh', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Freshly Sourced Equipment
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {products.length} New Items
            </Typography>
          </Box>

          {products.length > 0 ? (
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item xs={6} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} tone="light" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'common.white', border: '1px dashed rgba(10,25,47,0.18)', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                No new arrivals found at the moment. Please check back later.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    
    // Fetch recently added products
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 }) // Sort by newest
      .limit(16) // Limit to 16 products
      .populate('category')
      .lean()
      
    // Properly serialize Mongoose documents for Next.js props
    const serializedProducts = JSON.parse(JSON.stringify(recentProducts))
    
    return {
      props: {
        products: serializedProducts,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    return {
      props: {
        products: [],
      },
      revalidate: 60,
    }
  }
}

NewArrivals.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default NewArrivals
