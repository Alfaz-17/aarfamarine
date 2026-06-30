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

          {/* Asymmetric Compact Masonry Grid */}
          <Box sx={{ 
            columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
            columnGap: '12px',
            '& > div': {
              breakInside: 'avoid',
              mb: '12px',
              display: 'inline-block',
              width: '100%',
            }
          }}>
            {filteredImages.length > 0 ? (
              filteredImages.map((img, idx) => (
                <Box 
                  key={img._id || idx}
                  onClick={() => setLightboxImage(img.url)}
                  sx={{
                    position: 'relative',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'common.black',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    '&::before': {
                      content: '""', position: 'absolute', inset: 0, 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: 1.5, zIndex: 2, pointerEvents: 'none'
                    },
                    '&:hover img': { transform: 'scale(1.05)', opacity: 0.8 },
                    '&:hover .overlay': { opacity: 1 }
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={img.title || img.category} 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: 0.9
                    }} 
                  />
                  
                  {/* Technical Overlay */}
                  <Box className="overlay" sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.2) 60%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    p: 2, opacity: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 3
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 1.5, fontSize: '0.65rem' }}>
                          {img.category}
                        </Typography>
                        {img.title && (
                          <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mt: 0.2, lineHeight: 1.2 }}>
                            {img.title}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ 
                        width: 32, height: 32, borderRadius: '50%', 
                        bgcolor: 'primary.main', color: 'common.white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, ml: 1
                      }}>
                        <ZoomInIcon fontSize="small" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ columnSpan: 'all', py: 10, textAlign: 'center', border: '1px dashed rgba(10,25,47,0.2)', borderRadius: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
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
