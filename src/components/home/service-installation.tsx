import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Link from 'next/link'
import BuildIcon from '@mui/icons-material/Build'

interface ServiceInstallationProps {
  services?: any[]
}

const ServiceInstallation: FC<ServiceInstallationProps> = ({ services }) => {
  return (
    <Box sx={{ py: { xs: 10, md: 15 }, backgroundColor: '#051021', color: 'common.white', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ color: '#1E5FA6', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 2, fontFamily: 'Outfit, sans-serif' }}>
                Service & Installation
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, color: 'common.white', mb: 3, lineHeight: 1.1 }}>
                We Don't Just Sell &mdash; We Install &{' '}
                <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
                  Service Too
                  <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(2deg)', '& img': { width: { xs: 70, md: 90 }, opacity: 0.9 }, zIndex: -1 }}>
                    <img src="/images/headline-curve.svg" alt="Headline curve" />
                  </Box>
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                We provide on-site installation, testing, and commissioning for all the equipment we supply. Our certified engineers handle everything from fitting a simple GPS unit to setting up a full ECDIS navigation system.
              </Typography>
              
              <Link href="/services" passHref>
                <Button 
                  component="a"
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: '#1E5FA6', 
                    color: 'white', 
                    px: 4, py: 1.5, 
                    borderRadius: 50,
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#4a82b4' }
                  }}
                >
                  Learn More About Services
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 4, 
              p: { xs: 4, md: 5 },
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <BuildIcon sx={{ color: '#1E5FA6', fontSize: 32, mr: 2 }} />
                <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                  Equipment We Service
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {services && services.length > 0 ? services.map((service, idx) => (
                  <Box key={idx} sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    color: 'common.white', 
                    px: 2.5, py: 1.2, 
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'primary.light',
                      color: 'primary.light',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    {service.name}
                  </Box>
                )) : (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No services found.</Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ServiceInstallation
