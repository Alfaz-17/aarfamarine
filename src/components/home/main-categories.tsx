import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const categories = [
  {
    name: 'Navigation',
    image: '/images/categories/Navigation.jpg',
    description: 'Advanced radar systems, GPS, and ECDIS for safe global voyages.',
  },
  {
    name: 'Communication',
    image: '/images/categories/Communication.jpg',
    description: 'Reliable VHF, satellite, and internal communication networks.',
  },
  {
    name: 'Automation',
    image: '/images/categories/Automation.png',
    description: 'State-of-the-art vessel monitoring and control systems.',
  }
]

const CategoryCard = ({ category, isLarge = false }: { category: any, isLarge?: boolean }) => (
  <Link href={`/products?category=${category.name}`} passHref>
    <Box
      component="a"
      sx={{
        textDecoration: 'none',
        display: 'flex',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        height: isLarge ? { xs: 350, sm: 400, md: '100%' } : { xs: 300, sm: 350, md: '100%' },
        minHeight: isLarge ? { md: 520 } : { md: 248 },
        alignItems: 'flex-end',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
          '& .bg-image': {
            transform: 'scale(1.08)',
          },
          '& .overlay': {
            opacity: 0.8,
          },
          '& .explore-btn': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }
      }}
    >
      <Box
        className="bg-image"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${category.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10, 25, 47, 0.95) 0%, rgba(10, 25, 47, 0.4) 40%, transparent 100%)',
          opacity: 0.85,
          transition: 'opacity 0.5s ease',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 4 }, width: '100%' }}>
        <Typography variant="h4" component="h3" sx={{ color: 'common.white', fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: isLarge ? '2.2rem' : '1.6rem' } }}>
          {category.name}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', mb: 2, lineHeight: 1.6 }}>
          {category.description}
        </Typography>
        <Box 
          className="explore-btn"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            color: 'secondary.main', 
            fontWeight: 700,
            opacity: { xs: 1, md: 0 },
            transform: { xs: 'translateY(0)', md: 'translateY(10px)' },
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          Explore Equipment <ArrowForwardIcon fontSize="small" />
        </Box>
      </Box>
    </Box>
  </Link>
)

const MainCategories: FC = () => {
  return (
    <Box id="main-categories" sx={{ py: { xs: 6, md: 6 }, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 2 }}>
            Equipment Categories
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'text.primary', position: 'relative', display: 'inline-block' }}>
            Explore Our Core{' '}
            <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
              Categories
              <Box sx={{ position: 'absolute', bottom: '0px', left: { xs: '50%', md: 0 }, transform: { xs: 'translateX(-50%) rotate(2deg)', md: 'rotate(2deg)' }, '& img': { width: { xs: 80, md: 120 }, opacity: 0.9 }, zIndex: -1 }}>
                <img src="/images/headline-curve.svg" alt="Headline curve" />
              </Box>
            </Box>
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Large Left Card */}
          <Grid item xs={12} md={6}>
            <CategoryCard category={categories[0]} isLarge />
          </Grid>
          
          {/* Two Smaller Right Cards Stacked */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12}>
                <CategoryCard category={categories[1]} />
              </Grid>
              <Grid item xs={12}>
                <CategoryCard category={categories[2]} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default MainCategories
