import React, { FC, useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Head from 'next/head'
import { StyledButton } from '@/components/styled-button'
import { useRouter } from 'next/router'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'

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
  const [videoLoaded, setVideoLoaded] = useState(false)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoSrc, setVideoSrc] = useState('/videos/hero.webm')
  
  const headline = data?.heroHeadline || "Marine Navigation & Communication Systems"
  const subtitle = data?.heroSubtitle || "Trader, distributor, and service provider for reconditioned marine electronics, navigation aids, and automation equipment."
  const stats = data?.heroStats || defaultExps

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 600px)')
    const updateVideoSource = () => {
      setVideoSrc(mobileQuery.matches ? '/videos/hero-mobile.mp4' : '/videos/hero.webm')
    }

    updateVideoSource()
    mobileQuery.addEventListener('change', updateVideoSource)

    return () => mobileQuery.removeEventListener('change', updateVideoSource)
  }, [])

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
        {/* Video element with poster for fast first-frame display */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
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
        >
          <source src={videoSrc} type={videoSrc.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
        </video>
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

              <Box component="form" onSubmit={handleSearch} sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center',
                width: '100%', 
                maxWidth: { xs: '100%', sm: 480 },
                mx: 'auto',
                mb: 3,
                backgroundColor: 'common.white',
                borderRadius: 50,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                p: 0.75,
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(75, 163, 227, 0.5)',
                }
              }}>
                <InputBase
                  placeholder="Search for marine equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    ml: 2.5, 
                    flex: 1, 
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    '& input::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.8
                    }
                  }}
                />
                <IconButton type="submit" sx={{ 
                  p: 1.5, 
                  mr: 0.25,
                  color: 'common.white', 
                  backgroundColor: 'primary.main', 
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)'
                  } 
                }}>
                  <SearchIcon />
                </IconButton>
              </Box>

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
