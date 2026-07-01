import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { FooterSocialLinks } from '@/components/footer'
import { Logo } from '@/components/logo'
import { client } from '@/lib/sanity'

const Footer: FC = () => {
  const [settings, setSettings] = React.useState<any>(null)

  React.useEffect(() => {
    client.fetch(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`)
      .then((data) => {
        if (data) setSettings(data)
      })
      .catch((err) => console.error("Failed to fetch siteSettings", err))
  }, [])

  return (
    <Box
      id="contact"
      component="footer"
      sx={{
        backgroundColor: '#0a192f',
        position: 'relative',
        overflow: 'hidden',
        color: 'rgba(255,255,255,0.7)',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 5 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1E5FA6 0%, #4BA3E3 100%)',
        }
      }}
    >
      {/* Subtle Creative Dot Matrix Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: 'radial-gradient(#4BA3E3 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Company Brand Area */}
          <Grid item xs={12} md={4}>
            <Box sx={{ pr: { md: 2 } }}>
              <Box 
                sx={{ 
                  mb: 2, 
                  display: 'inline-block', 
                  bgcolor: 'common.white', 
                  p: 1, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transform: 'scale(0.8)',
                  transformOrigin: 'left'
                }}
              >
                <Logo />
              </Box>
              <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 800, mb: 0.5, letterSpacing: 0.5 }}>
                AARFA MARINE
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'primary.light', letterSpacing: 1.5, mb: 2, fontWeight: 600, textTransform: 'uppercase' }}
              >
                Marine Navigation Specialists
              </Typography>
              <Typography variant="body1" sx={{ mb: 2.5, lineHeight: 1.7, fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
                Your trusted partner in marine navigation, supplying reconditioned, tested, and certified marine electronics worldwide.
              </Typography>
              <FooterSocialLinks />
            </Box>
          </Grid>

          {/* Quick Links Card */}
          <Grid item xs={12} md={2}>
            <Box sx={{ 
              height: '100%', 
              p: 2.5,
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.85rem' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Services', '/services'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([label, path]) => (
                  <Link 
                    key={label}
                    href={path} 
                    sx={{ 
                      color: 'rgba(255,255,255,0.85)', 
                      textDecoration: 'none', 
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      '&::before': {
                        content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.light', mr: 1.5, opacity: 0, transition: 'opacity 0.2s ease'
                      },
                      '&:hover': { color: 'common.white', transform: 'translateX(5px)' },
                      '&:hover::before': { opacity: 1 }
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Head Office Card */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              height: '100%', 
              p: 2.5,
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.85rem' }}>
                Head Office
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ fontSize: 22, color: 'primary.light', mt: 0.2 }} />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {settings?.headOfficeAddress || 'Navapara Prime, Shop No. 28\nHaluria Chowk to Navapara Road\nBhavnagar 364001, Gujarat, India'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info Card */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              height: '100%', 
              p: 2.5,
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.85rem' }}>
                Contact Us
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Professional Founder Design */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex' }}>
                    <PersonIcon sx={{ fontSize: 22, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 0.5 }}>MD & FOUNDER</Typography>
                    <Typography variant="body1" sx={{ color: 'common.white', fontWeight: 600, fontSize: '0.95rem' }}>Mr. Afjal Sarvaiya</Typography>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                    <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>PHONE</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', mb: 0.5 }}>{settings?.tel1 || '+91 9081811248'}</Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', mb: 0.5 }}>{settings?.tel2 || '+91 8160002323'}</Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>{settings?.tel3 || '+91 8306161422'}</Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                    <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>EMAIL</Typography>
                  </Box>
                  <Link href={`mailto:${settings?.email1 || 'sales@aarfamarine.com'}`} sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', mb: 0.5, textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: 'primary.light' } }}>
                    {settings?.email1 || 'sales@aarfamarine.com'}
                  </Link>
                  <Link href={`mailto:${settings?.email2 || 'aarfamarine@gmail.com'}`} sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', mb: 0.5, textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: 'primary.light' } }}>
                    {settings?.email2 || 'aarfamarine@gmail.com'}
                  </Link>
                  <Link href={`mailto:${settings?.email3 || 'info@aarfamarine.com'}`} sx={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: 'primary.light' } }}>
                    {settings?.email3 || 'info@aarfamarine.com'}
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Aarfa Marine. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Link href="/privacy" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.light' } }}>Privacy Policy</Link>
            <Link href="/terms" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.light' } }}>Terms of Service</Link>
            <Typography component="a" href="https://alfaz-dev.vercel.app/" target="_blank" rel="noopener noreferrer" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.light' } }}>
              Developed by <span style={{ color: '#93C5FD', fontWeight: 600 }}>Alfaz</span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
