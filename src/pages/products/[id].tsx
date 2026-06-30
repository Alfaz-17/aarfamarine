import React, { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import { X as CloseIcon } from 'lucide-react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import PageHero from '@/components/page-hero'
import ProductCard from '@/components/product-card'
import { InquiryModal } from '@/components/common/inquiry-modal'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'

interface ProductDetailPageProps {
  product: any
  relatedProducts: any[]
}

const ProductDetailPage: NextPageWithLayout<ProductDetailPageProps> = ({ product, relatedProducts }) => {
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const handleRequestQuoteClick = () => {
    setInquiryMessage(`I am interested in requesting a quote for: ${product.title}`)
    setIsModalOpen(true)
  }

  if (!product) {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4">Product Not Found</Typography>
      </Box>
    )
  }

  // Parse specifications if it exists (assuming it's an object)
  const renderSpecifications = () => {
    if (!product.specifications || typeof product.specifications !== 'object') return null
    
    return (
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Technical Specifications
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
          <Table>
            <TableBody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, width: '30%', bgcolor: 'grey.50' }}>
                    {key}
                  </TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>{product.metaTitle || product.title} | Aarfa Marine</title>
        <meta name="description" content={product.metaDescription || product.description?.substring(0, 160)} />
      </Head>

      {/* Top Navigation Banner / Hero */}
      <PageHero
        title={product.title}
        image={product.image || product.images?.[0] || '/images/marine-bridge.jpg'}
        compact
      />

      {/* Main Content */}
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs and Back Navigation */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: { xs: 4, md: 6 }, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              <Link href="/" passHref>
                <Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Home</Box>
              </Link>
              <Link href="/products" passHref>
                <Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Products</Box>
              </Link>
              <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{product.title}</Typography>
            </Breadcrumbs>
            
            <Link href="/products" passHref>
              <Button 
                component="a" 
                startIcon={<ChevronLeft size={20} />} 
                variant="outlined"
                color="inherit"
                sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: 1, 
                  fontWeight: 600, 
                  borderRadius: 50,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'grey.50', color: 'primary.main' } 
                }}
              >
                Back to Products
              </Button>
            </Link>
          </Box>

          <Grid container spacing={{ xs: 4, md: 8 }}>
            {/* Left: Images */}
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  bgcolor: 'background.default', 
                  borderRadius: 1, 
                  p: 4, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: { xs: 280, sm: 360, md: 400 },
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
                onClick={() => {
                  if (product.image || product.images?.[0]) {
                    setLightboxImage(product.image || product.images[0])
                  }
                }}
              >
                {product.featured && (
                  <Chip 
                    label="Featured" 
                    color="primary" 
                    sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 700 }} 
                  />
                )}
                {product.image || product.images?.[0] ? (
                  <img
                    src={product.image || product.images[0]}
                    alt={product.title}
                    style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }}
                  />
                ) : (
                  <Typography color="text.secondary">No Image Available</Typography>
                )}
              </Box>
              
              {/* Secondary Images if any */}
              {product.images && product.images.length > 1 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {product.images.map((img: string, idx: number) => (
                    <Grid item xs={3} key={idx}>
                      <Box 
                        sx={{ 
                          bgcolor: 'background.default', borderRadius: 1, p: 1, height: 80, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', border: '2px solid transparent',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                        onClick={() => setLightboxImage(img)}
                      >
                         <img src={img} alt={`${product.title} ${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Right: Details */}
            <Grid item xs={12} md={6}>
              {product.brandName && (
                <Typography sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1 }}>
                  {product.brandName}
                </Typography>
              )}
              
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 2 }}>
                {product.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 3 }, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>

                
                {product.sku && (
                  <Typography variant="body2" color="text.secondary">
                    SKU: <strong>{product.sku}</strong>
                  </Typography>
                )}
              </Box>

              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.05rem' }, mb: 5 }}>
                {product.description || 'No description available for this product.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 6, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleRequestQuoteClick}
                  sx={{ py: 1.5, px: 4, fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
                >
                  Request Quote
                </Button>
                <Button variant="outlined" size="large" sx={{ py: 1.5, px: 4, fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}>
                  Contact Sales
                </Button>
              </Box>

              {/* Keywords/Tags */}
              {product.keywords && product.keywords.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.keywords.map((kw: string, idx: number) => (
                    <Chip key={idx} label={kw} size="small" sx={{ bgcolor: 'grey.100', color: 'text.secondary' }} />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Specifications Table */}
          {renderSpecifications()}

          {/* Related Products Section */}
          {relatedProducts && relatedProducts.length > 0 && (
            <Box sx={{ mt: 10, pt: 6, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: 'primary.main' }}>
                Suggested Products
              </Typography>
              <Grid container spacing={4}>
                {relatedProducts.map((relProduct) => (
                  <Grid item xs={12} sm={6} md={3} key={relProduct._id}>
                    <ProductCard product={relProduct} tone="light" />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
        </Container>
      </Box>

      <InquiryModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="Product Page"
        defaultMessage={inquiryMessage}
      />

      {/* Image Lightbox */}
      <Dialog 
        open={!!lightboxImage} 
        onClose={() => setLightboxImage(null)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', m: 0, p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } }}
      >
        <IconButton 
          onClick={() => setLightboxImage(null)} 
          sx={{ 
            position: 'fixed', 
            top: { xs: 16, md: 32 }, 
            right: { xs: 16, md: 32 }, 
            color: 'white', 
            bgcolor: 'rgba(0,0,0,0.7)', 
            border: '2px solid rgba(255,255,255,0.3)',
            width: 56,
            height: 56,
            zIndex: 9999,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: 'primary.main', borderColor: 'white', transform: 'scale(1.1)' } 
          }}
          aria-label="Close"
        >
          <CloseIcon size={32} />
        </IconButton>
        {lightboxImage && (
          <img src={lightboxImage} alt="Enlarged product view" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        )}
      </Dialog>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Pre-render no pages at build time, render on demand
    fallback: 'blocking' // Wait for HTML to generate on first request
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    await connectToDatabase()
    
    const { id } = context.params as { id: string }
    
    // Check if ID is a valid ObjectId, otherwise treat it as a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
    const product = isObjectId 
      ? await Product.findById(id).populate('category brand').lean() 
      : await Product.findOne({ slug: id }).populate('category brand').lean()

    if (!product) {
      return { notFound: true }
    }

    // Fetch related products (same category)
    let relatedProducts = []
    if (product.category) {
      relatedProducts = await Product.find({ 
        category: product.category._id,
        _id: { $ne: product._id }
      }).limit(4).lean()
    }
    
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        relatedProducts: JSON.parse(JSON.stringify(relatedProducts))
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error in getStaticProps for product:", error)
    return { notFound: true }
  }
}

ProductDetailPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default ProductDetailPage
