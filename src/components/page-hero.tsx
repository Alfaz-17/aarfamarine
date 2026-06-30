import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

interface PageHeroProps {
  title: string
  subtitle?: string
  image?: string
  compact?: boolean
  children?: React.ReactNode
}

const PageHero: FC<PageHeroProps> = ({ title, subtitle, image = '/images/marine-bridge.jpg', compact = false, children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: compact ? { xs: 180, md: 220 } : { xs: 320, md: 420 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pt: compact ? { xs: 14, md: 18 } : { xs: 16, md: 22 },
        pb: compact ? { xs: 4, md: 5 } : { xs: 7, md: 9 },
        color: 'common.white',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(5,16,33,0.92) 0%, rgba(10,31,64,0.78) 55%, rgba(30,95,166,0.62) 100%)',
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h1" sx={{ fontSize: compact ? { xs: '1.75rem', md: '2.75rem' } : { xs: '2.35rem', md: '4rem' }, fontWeight: 800, mb: compact ? 3 : 4, letterSpacing: 0 }}>
          <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
            {title}
            <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(-1.5deg)', '& img': { width: '90%', minWidth: 120, opacity: 0.9 }, zIndex: -1 }}>
              <img src="/images/headline-curve.svg" alt="Headline curve" />
            </Box>
          </Box>
        </Typography>
        {subtitle && (
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.82)', fontWeight: 400, maxWidth: 680, mx: 'auto', lineHeight: 1.7, fontSize: compact ? { xs: '0.9rem', md: '1.05rem' } : undefined }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  )
}

export default PageHero

