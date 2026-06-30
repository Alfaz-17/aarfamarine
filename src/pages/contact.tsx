import React from 'react'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Email, Phone, LocationOn, Person } from '@mui/icons-material'
import dynamic from 'next/dynamic'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import { SEO } from '@/components/seo/SEO'
import { client } from '@/lib/sanity'
import { GetStaticProps } from 'next'

const PageHero = dynamic(() => import('@/components/page-hero'))

interface ContactProps {
  settings: any
}

const Contact: NextPageWithLayout<ContactProps> = ({ settings }) => {
  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with Aarfa Marine for all your marine electronics, navigation, and automation equipment needs. We provide global export and technical support."
        canonicalUrl="/contact"
      />

      <PageHero 
        title="Contact Aarfa Marine" 
        subtitle="Reach out to our marine electronics experts for consultation, quotes, or support."
        image="/images/why-choose-us.jpg"
      />

      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }}>
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', mb: 2, display: 'block' }}>
                Get In Touch
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4, color: 'text.primary' }}>
                We are ready to assist your fleet.
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 6, fontSize: '1.05rem', lineHeight: 1.7 }}>
                Whether you need a quick spare part delivered to your next port of call or a full bridge refit consultation, our team is available 24/7.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ bgcolor: '#1E5FA61A', p: 2, borderRadius: 1, display: 'flex' }}>
                    <LocationOn sx={{ color: 'primary.light' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, color: 'text.primary' }}>Head Office</Typography>
                    <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{settings?.branchOfficeAddress || 'Alang Shipbreaking Yard,\nBhavnagar, Gujarat, India'}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ bgcolor: '#1E5FA61A', p: 2, borderRadius: 1, display: 'flex' }}>
                    <Email sx={{ color: 'primary.light' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, color: 'text.primary' }}>Email Us</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{settings?.email1 || 'sales@aarfamarine.com'}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ bgcolor: '#1E5FA61A', p: 2, borderRadius: 1, display: 'flex' }}>
                    <Phone sx={{ color: 'primary.light' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, color: 'text.primary' }}>Call Us 24/7</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{settings?.tel1 || '+91 123 456 7890'}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ bgcolor: '#1E5FA61A', p: 2, borderRadius: 1, display: 'flex' }}>
                    <Person sx={{ color: 'primary.light' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, color: 'text.primary' }}>Founder</Typography>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Afzal Sarvaiya</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>Marine Electronics Engineer</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                bgcolor: 'common.white',
                border: '1px solid rgba(10,25,47,0.1)',
                boxShadow: '0 16px 40px rgba(10,25,47,0.08)',
                p: { xs: 3, sm: 4, md: 6 }, 
                borderRadius: 1 
              }}>
                <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
                  Send an Inquiry
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Your Name" 
                      variant="outlined" 
                      sx={{ '& .MuiOutlinedInput-root': { color: 'text.primary', '& fieldset': { borderColor: 'divider' }, '&:hover fieldset': { borderColor: 'primary.light' } } }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Company / Vessel" 
                      variant="outlined" 
                      sx={{ '& .MuiOutlinedInput-root': { color: 'text.primary', '& fieldset': { borderColor: 'divider' }, '&:hover fieldset': { borderColor: 'primary.light' } } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Email Address" 
                      variant="outlined" 
                      sx={{ '& .MuiOutlinedInput-root': { color: 'text.primary', '& fieldset': { borderColor: 'divider' }, '&:hover fieldset': { borderColor: 'primary.light' } } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Message or Required Parts" 
                      multiline 
                      rows={4} 
                      variant="outlined" 
                      sx={{ '& .MuiOutlinedInput-root': { color: 'text.primary', '& fieldset': { borderColor: 'divider' }, '&:hover fieldset': { borderColor: 'primary.light' } } }} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      fullWidth 
                      sx={{ 
                        py: 2, 
                        fontWeight: 700, 
                        bgcolor: 'primary.main', 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'primary.light' } 
                      }}
                    >
                      Submit Inquiry
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

Contact.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export const getStaticProps: GetStaticProps = async () => {
  try {
    const settings = await client.fetch(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`)
    return {
      props: {
        settings: settings || null,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: {
        settings: null,
      },
      revalidate: 60,
    }
  }
}

export default Contact
