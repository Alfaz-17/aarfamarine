import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/system'
import ProductCard from '../product-card'

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`

interface FeaturedProductsProps {
  products: any[]
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <Box
      id="featured-products"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: { xs: 2, md: 4 } }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 24, height: 2, bgcolor: 'primary.light' }} />
              <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                Featured Products
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.25rem', sm: '2.5rem', md: '3rem' }, color: 'primary.main', lineHeight: 1.15 }}>
              <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
                Equipment
                <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', '& img': { width: { xs: 80, md: 100 }, opacity: 0.9 }, zIndex: -1 }}>
                  <img src="/images/headline-curve.svg" alt="Headline curve" />
                </Box>
              </Box>{' '}
              For Every<br />
              <Typography component="span" sx={{ color: 'primary.light', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}>
                Maritime Need
              </Typography>
            </Typography>
          </Box>
        </Box>

        {products && products.length > 0 ? (
          <Box
            sx={{
              width: '100vw',
              ml: 'calc(-50vw + 50%)',
              overflow: 'hidden',
              py: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1.25, sm: 2.5, md: 4 },
                pr: { xs: 1.25, sm: 2.5, md: 4 }, // padding equal to gap for seamless infinite loop
                width: 'max-content',
                animation: `${scrollAnimation} 40s linear infinite`,
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {[...products, ...products, ...products, ...products].map((product, index) => (
                <Box
                  key={`${product._id}-${index}`}
                  sx={{
                    width: { xs: '70vw', sm: 250, md: 340 },
                    maxWidth: { xs: '100%', sm: 250, md: 340 },
                    minWidth: { xs: '70vw', sm: 250, md: 340 },
                    flexShrink: 0,
                  }}
                >
                  <ProductCard product={product} tone="light" />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Currently no featured products available. Please check back later.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default FeaturedProducts
