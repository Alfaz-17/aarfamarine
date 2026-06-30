import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import { SEO } from '@/components/seo/SEO'
import dynamic from 'next/dynamic'
const PageHero = dynamic(() => import('@/components/page-hero'))
import { CtaBand, KeyFacts, CustomerReviews } from '@/components/home'
import { InquiryModal } from '@/components/common/inquiry-modal'
import connectToDatabase from '@/lib/db'
import { Service } from '@/lib/models'

interface ServicesProps {
  services: any[]
}

const Services: NextPageWithLayout<ServicesProps> = ({ services }) => {
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleServiceClick = (serviceName: string) => {
    setInquiryMessage(`I am inquiring about the ${serviceName} service.`)
    setIsModalOpen(true)
  }

  return (
    <>
      <SEO 
        title="Our Services"
        description="Aarfa Marine offers supply, installation, and after-sales service for marine electronics, automation, and navigation equipment."
        canonicalUrl="/services"
      />

      <PageHero 
        title="Our Services & Installation" 
        subtitle="Comprehensive supply, installation, and troubleshooting of maritime navigation and communication systems."
        image="/images/marine-radio.jpg"
      />



      {/* Dynamic Services Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'text.primary', position: 'relative', display: 'inline-block' }}>
              Comprehensive Service{' '}
              <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
                Coverage
                <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', '& img': { width: { xs: 80, md: 120 }, opacity: 0.9 }, zIndex: -1 }}>
                  <img src="/images/headline-curve.svg" alt="Headline curve" />
                </Box>
              </Box>
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {services && services.length > 0 ? (
              services.map((service, index) => (
                <Grid item xs={6} sm={6} md={4} key={service._id || index}>
                  <Card 
                    onClick={() => handleServiceClick(service.name)}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '0 8px 20px rgba(10,25,47,0.07)',
                      transition: 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        bgcolor: 'primary.main',
                        borderColor: 'primary.main',
                        boxShadow: '0 20px 40px rgba(10,25,47,0.2), 0 8px 16px #1E5FA624',
                        '& .service-img': {
                          transform: 'scale(1.08)',
                        },
                        '& .service-title': {
                          color: 'common.white',
                        },
                        '& .service-desc': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                      }
                    }}>
                    <Box sx={{ overflow: 'hidden', height: { xs: 120, sm: 200 } }}>
                      <CardMedia
                        className="service-img"
                        component="img"
                        sx={{ 
                          height: '100%',
                          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                        }}
                        image={service.img || '/images/marine-radio.jpg'}
                        alt={service.name}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 } }}>
                      <Typography className="service-title" variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: { xs: '1.05rem', sm: '1.5rem' }, transition: 'color 0.3s ease' }}>
                        {service.name}
                      </Typography>
                      <Typography className="service-desc" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.95rem' }, lineHeight: { xs: 1.4, sm: 1.6 }, transition: 'color 0.3s ease' }}>
                        {service.dec}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>No services available in the database.</Typography>
              </Box>
            )}
          </Grid>
        </Container>
      </Box>

      <InquiryModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="Services Page"
        defaultMessage={inquiryMessage}
      />

      <KeyFacts />
      <CustomerReviews />

      <CtaBand tone="dark" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    
    // Fetch all services from the database
    const services = await Service.find({}).lean()
    
    // Properly serialize Mongoose documents for Next.js
    const serializedServices = JSON.parse(JSON.stringify(services))

    return {
      props: {
        services: serializedServices,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching services:", error)
    return {
      props: {
        services: [],
      },
    }
  }
}

Services.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default Services
