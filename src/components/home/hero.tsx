import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Head from 'next/head'
import { StyledButton } from '@/components/styled-button'

interface Exp {
  label: string
  value: string
}
interface ExpItemProps {
  item: Exp
}

const defaultExps: Array<Exp> = [
  {
    label: 'Years Experience',
    value: '9+',
  },
  {
    label: 'Product Categories',
    value: '20+',
  },
  {
    label: 'Global Export',
    value: '100%',
  },
]

const ExpItem: FC<ExpItemProps> = ({ item }) => {
  const { value, label } = item
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 0.25, sm: 1.5 },
      py: { xs: 0.5, md: 0 }
    }}>
      <Typography
        sx={{ color: 'secondary.main', fontSize: { xs: 22, md: 26 }, fontWeight: 800 }}
      >
        {value}
      </Typography>
      <Typography sx={{ color: '#D9EAF8', fontSize: { xs: '0.62rem', sm: '0.8rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: { xs: 0.5, sm: 1 }, textAlign: 'center', lineHeight: 1.25 }}>
        {label}
      </Typography>
    </Box>
  )
}

interface HomeHeroProps {
  data?: any
}

const HomeHero: FC<HomeHeroProps> = ({ data }) => {
  const headline = data?.heroHeadline || "Marine Navigation & Communication Systems"
  const subtitle = data?.heroSubtitle || "Trader, distributor, and service provider for reconditioned marine electronics, navigation aids, and automation equipment."
  const stats = data?.heroStats || defaultExps

  return (
    <>
      <Head>
        <link rel="preload" href="/videos/hero-poster.jpg" as="image" />
      </Head>
      <Box id="hero" sx={{ 
        position: 'relative', 
        minHeight: { xs: '100svh', md: '100vh' },
        height: { xs: '100svh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 11.5, sm: 12.5, md: 8 },
        pb: { xs: 2.5, md: 2 },
        overflow: 'hidden',
        backgroundColor: 'primary.dark',
      }}>
        {/* Background hero video — single compressed MP4, no JS needed */}
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/hero.mp4"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left center',
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: 0.8,
          }}
        />
      {/* Slight black overlay for cinematic feel and text contrast */}
      <Box sx={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        zIndex: 2 
      }} />
      <Container maxWidth="lg" sx={{ 
        position: 'relative',
        zIndex: 3,
        height: { md: '100%' }, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between' 
      }}>
        <Grid container spacing={0} sx={{ 
          flexDirection: 'column', 
          flex: { md: 1 }, 
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 6, md: 12 },
          pb: 0
        }}>
          <Grid item xs={12} md={10} lg={8} sx={{ mx: 'auto' }}>
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                mt: 0,
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.4rem', lg: '2.8rem' },
                  fontWeight: 800,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  letterSpacing: 0,
                  color: 'common.white',
                  mb: 0,
                  maxWidth: { xs: '100%', md: 850 },
                  mx: 'auto',
                  textShadow: '0px 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <span dangerouslySetInnerHTML={{ 
                  __html: headline
                    .replace('Navigation', '<span style="color:#93C5FD">Navigation</span>')
                    .replace('Automation', '<span style="color:#93C5FD">Automation</span>')
                    .replace('Communication', '<span style="color:#93C5FD">Communication</span>') 
                }} />
              </Typography>

              <Typography 
                sx={{ 
                  color: '#F8FAFC',
                  lineHeight: { xs: 1.8, md: 1.3 },
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  fontWeight: 400,
                  mt: { xs: 0.5, md: 0.5 },
                  mb: { xs: 1.5, md: 2 },
                  maxWidth: { xs: 520, md: 600 },
                  mx: 'auto',
                  textShadow: '0px 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                {subtitle}
              </Typography>


              <Box sx={{ display: 'flex', flexDirection: 'row', width: 'auto', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1.25, sm: 2 } }}>
                <Link href="/products" passHref>
                  <StyledButton color="primary" size="large" variant="contained" sx={{
                    borderRadius: 1,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    letterSpacing: 1,
                    fontSize: { xs: '0.68rem', md: '0.75rem' },
                    px: { xs: 2.4, md: 4.5 },
                    py: { xs: 0.8, md: 1 },
                    width: 'auto',
                    minWidth: { xs: 128, sm: 140 },
                    backgroundColor: 'primary.main',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      backgroundColor: 'primary.light',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)' 
                    }
                  }}>
                    Explore
                  </StyledButton>
                </Link>
                <Link href="/contact" passHref>
                  <StyledButton size="large" variant="outlined" sx={{
                    borderRadius: 1,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: 'common.white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(5px)',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    letterSpacing: 1,
                    fontSize: { xs: '0.68rem', md: '0.75rem' },
                    px: { xs: 2.4, md: 4.5 },
                    py: { xs: 0.8, md: 1 },
                    width: 'auto',
                    minWidth: { xs: 128, sm: 140 },
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      borderColor: 'common.white', 
                      backgroundColor: 'rgba(255, 255, 255, 0.12)' 
                    }
                  }}>
                    Contact
                  </StyledButton>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {/* Experience Stats - Card-less Clean Text */}
        <Box sx={{ 
          py: 2, 
          mt: { xs: 2, md: 2 },
          mb: { xs: 0, md: 2 },
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            {stats.map((item: any) => (
              <Grid key={item.label} item xs={4} md={4}>
                <ExpItem item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
    </>
  )
}

export default HomeHero
