import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
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
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 6 },
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
        <Grid container spacing={4}>
          {/* Company Brand Area */}
          <Grid item xs={12} md={4}>
            <Box sx={{ pr: { md: 2 } }}>
              <Box 
                sx={{ 
                  mb: 3, 
                  display: 'inline-block', 
                  bgcolor: 'common.white', 
                  p: 1.5, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              >
                <Logo />
              </Box>
              <Typography variant="h5" sx={{ color: 'common.white', fontWeight: 800, mb: 1, letterSpacing: 0.5 }}>
                AARFA MARINE
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'primary.light', letterSpacing: 2, mb: 3, fontWeight: 600, textTransform: 'uppercase' }}
              >
                Marine Navigation Specialists
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
                Your trusted partner in marine navigation, supplying reconditioned, tested, and certified marine electronics worldwide.
              </Typography>
              <FooterSocialLinks />
            </Box>
          </Grid>

          {/* Quick Links Card */}
          <Grid item xs={12} md={2}>
            <Box sx={{ 
              height: '100%', 
              bgcolor: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 3, 
              p: 3,
              transition: 'transform 0.3s ease, background 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.04)' }
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Services', '/services'], ['Contact', '/contact']].map(([label, path]) => (
                  <Link 
                    key={label}
                    href={path} 
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      textDecoration: 'none', 
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      '&::before': {
                        content: '""', width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.light', mr: 1.5, opacity: 0, transition: 'opacity 0.2s ease'
                      },
                      '&:hover': { color: 'common.white', transform: 'translateX(3px)' },
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
              bgcolor: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 3, 
              p: 3,
              transition: 'transform 0.3s ease, background 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.04)' }
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Head Office
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {settings?.headOfficeAddress || 'Navapara Prime, Shop No. 28\nHaluria Chowk to Navapara Road\nBhavnagar 364001, Gujarat, India'}
              </Typography>
            </Box>
          </Grid>

          {/* Contact Info Card */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              height: '100%', 
              bgcolor: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 3, 
              p: 3,
              transition: 'transform 0.3s ease, background 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255,255,255,0.04)' }
            }}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Contact Us
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'common.white' }}>MD & Founder: Afjal Sarvaiya</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', mb: 0.5, fontWeight: 600 }}>PHONE</Typography>
                  <Typography variant="body2" sx={{ color: 'common.white' }}>{settings?.tel1 || '+91 9081811248'}</Typography>
                  <Typography variant="body2" sx={{ color: 'common.white', mt: 0.3 }}>{settings?.tel2 || '+91 8160002323'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', mb: 0.5, fontWeight: 600 }}>EMAIL</Typography>
                  <Link href={`mailto:${settings?.email1 || 'sales@aarfamarine.com'}`} sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: 'primary.light' } }}>
                    {settings?.email1 || 'sales@aarfamarine.com'}
                  </Link>
                  <Link href={`mailto:${settings?.email2 || 'aarfamarine@gmail.com'}`} sx={{ display: 'block', mt: 0.3, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: 'primary.light' } }}>
                    {settings?.email2 || 'aarfamarine@gmail.com'}
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom Area */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; {new Date().getFullYear()} Aarfa Marine. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.light' } }}>Privacy Policy</Link>
            <Link href="/terms" sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.light' } }}>Terms of Service</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
