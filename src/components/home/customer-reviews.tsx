import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import StarIcon from '@mui/icons-material/Star'

const reviews = [
  { name: 'Oleg Shcherbakov', country: 'Austria', product: 'Gyrocompass' },
  { name: 'Rafael', country: 'Venezuela', product: 'Navigational Equipment' },
  { name: 'Tran Khanh Tuong', country: 'Vietnam', product: 'Fish Finder' },
  { name: 'Barwil Syed Shafi', country: 'Chennai', product: 'Gyrocompass' },
  { name: 'Sandeep Surana', country: 'Kolkata', product: 'Fish Finder' },
  { name: 'Allipilli Chinnarao', country: 'Visakhapatnam', product: 'Marine GPS' },
]

const CustomerReviews: FC = () => {
  return (
    <Box id="customer-reviews" sx={{ py: { xs: 1, md: 1.5 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0 }}>
            Testimonials
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.4rem' }, fontWeight: 700, color: 'text.primary', position: 'relative', display: 'inline-block' }}>
            Trusted by Customers Across the World
            <Box sx={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(-1deg)', '& img': { width: { xs: 60, md: 80 }, opacity: 0.6 }, zIndex: -1 }}>
              <img src="/images/headline-curve.svg" alt="Headline curve" />
            </Box>
          </Typography>
        </Box>
        
        <Grid container spacing={1.5} alignItems="flex-start" sx={{ pb: 1 }}>
          {reviews.map((review, idx) => {
            const isDark = idx % 3 === 1; // Middle column is dark
            return (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ 
                  width: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'primary.dark' : 'background.paper',
                  color: isDark ? 'common.white' : 'text.primary',
                }}>
                  <CardContent sx={{ p: '12px !important' }}>
                    <Box sx={{ display: 'flex', color: '#FAAF00', mb: 0.5 }}>
                      {[1,2,3,4,5].map(star => <StarIcon key={star} sx={{ fontSize: '0.8rem' }} />)}
                    </Box>
                    <Typography sx={{ 
                      color: isDark ? 'rgba(255,255,255,0.85)' : 'text.secondary', 
                      fontStyle: 'italic', 
                      mb: 1,
                      fontSize: '0.8rem',
                      lineHeight: 1.3
                    }}>
                      "Fast delivery for our {review.product} requirements."
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: isDark ? 'primary.main' : 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'common.white',
                        fontWeight: 800,
                        fontSize: '0.7rem'
                      }}>
                        {review.name.charAt(0)}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: isDark ? 'common.white' : 'text.primary', fontSize: '0.75rem', lineHeight: 1.1 }}>{review.name}</Typography>
                        <Typography variant="body2" sx={{ color: isDark ? 'secondary.main' : 'primary.main', fontWeight: 600, fontSize: '0.65rem', lineHeight: 1.1 }}>{review.country}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

export default CustomerReviews
