import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import dynamic from 'next/dynamic'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import { SEO } from '@/components/seo/SEO'
import connectToDatabase from '@/lib/db'
import { GalleryImage } from '@/lib/models'

const PageHero = dynamic(() => import('@/components/page-hero'))

interface GalleryProps {
  images: any[]
}

const Gallery: NextPageWithLayout<GalleryProps> = ({ images }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const filteredImages = activeTab === 'all' 
    ? images 
    : images.filter(img => img.category === activeTab)

  return (
    <>
      <SEO 
        title="Photo Gallery"
        description="Explore Aarfa Marine's state-of-the-art office and workshop facilities where we test, recondition, and certify marine electronics."
        canonicalUrl="/gallery"
      />

      <PageHero 
        title="Photo Gallery" 
        subtitle="Explore our workshop and testing facilities."
        image="/images/marine-bridge.jpg"
      />

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, v) => setActiveTab(v)}
              centered
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                '& .MuiTab-root': { fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, minWidth: 100 }
              }}
            >
              <Tab label="All Facilities" value="all" />
              <Tab label="Workshop" value="workshop" />
              <Tab label="Office" value="office" />
              <Tab label="Company" value="company" />
            </Tabs>
          </Box>

          {/* Technical Masonry-like Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            autoRows: 'minmax(250px, auto)'
          }}>
            {filteredImages.length > 0 ? (
              filteredImages.map((img, idx) => (
                <Box 
                  key={img._id || idx}
                  onClick={() => setLightboxImage(img.url)}
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'common.black',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    gridRow: idx % 4 === 0 ? 'span 2' : 'span 1',
                    minHeight: idx % 4 === 0 ? { xs: 300, md: 520 } : { xs: 250, md: 250 },
                    '&::before': {
                      content: '""', position: 'absolute', inset: 0, 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: 2, zIndex: 2, pointerEvents: 'none'
                    },
                    '&:hover img': { transform: 'scale(1.05)', opacity: 0.8 },
                    '&:hover .overlay': { opacity: 1, transform: 'translateY(0)' }
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={img.title || img.category} 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: 0.9
                    }} 
                  />
                  
                  {/* Technical Overlay */}
                  <Box className="overlay" sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.4) 40%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    p: 3, opacity: 0, transform: 'translateY(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 3
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 2 }}>
                          {img.category}
                        </Typography>
                        {img.title && (
                          <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 700, mt: 0.5, lineHeight: 1.2 }}>
                            {img.title}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ 
                        width: 40, height: 40, borderRadius: '50%', 
                        bgcolor: 'primary.main', color: 'common.white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, ml: 2
                      }}>
                        <ZoomInIcon />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ gridColumn: '1 / -1', py: 10, textAlign: 'center', border: '1px dashed rgba(10,25,47,0.2)', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No images uploaded yet.
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

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
            position: 'fixed', top: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, 
            color: 'white', bgcolor: 'rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.3)',
            width: 56, height: 56, zIndex: 9999, transition: 'all 0.2s',
            '&:hover': { bgcolor: 'primary.main', borderColor: 'white', transform: 'scale(1.1)' } 
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        {lightboxImage && (
          <img src={lightboxImage} alt="Enlarged view" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        )}
      </Dialog>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    const images = await GalleryImage.find({}).sort({ createdAt: -1 }).lean()
    
    return {
      props: {
        images: JSON.parse(JSON.stringify(images))
      },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: {
        images: []
      },
      revalidate: 60
    }
  }
}

Gallery.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default Gallery
