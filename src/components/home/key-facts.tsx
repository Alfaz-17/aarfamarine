import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const facts = [
  { label: 'Founded', value: '2018' },
  { label: 'Location', value: 'Bhavnagar, India' },
  { label: 'Experience', value: '13+ Years' },
  { label: 'Products in Stock', value: '500+ Items' },
  { label: 'Delivery Time', value: 'Within 24 Hours' },
  { label: 'Brands Available', value: '18+ Brands' },
  { label: 'Markets Served', value: 'Global' },
  { label: 'IndiaMART Rating', value: '4.4 / 5 Stars' },
]

const KeyFacts: FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 2 }}>
                Where We Are Going
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 700, color: 'text.primary', mb: 3 }}>
                Our{' '}
                <Box component="span" sx={{ position: 'relative', display: 'inline-block', pb: { xs: 2, md: 3 } }}>
                  Vision
                  <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', '& img': { width: { xs: 70, md: 80 }, opacity: 0.9 }, zIndex: -1 }}>
                    <img src="/images/headline-curve.svg" alt="Headline curve" />
                  </Box>
                </Box>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                We want to be the go-to partner for every shipping company, fleet manager, and ship engineer looking for marine electronics. Our vision is to build a connected, trusted global network — where any vessel, anywhere in the world, can get the right equipment quickly and confidently.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ 
              bgcolor: '#051021', 
              color: 'common.white', 
              borderRadius: 3, 
              p: { xs: 3, sm: 5 },
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, color: '#D9EAF8' }}>
                Key Facts At A Glance
              </Typography>
              <Grid container spacing={3}>
                {facts.map((fact, idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Box sx={{ borderLeft: '3px solid #1E5FA6', pl: 2, py: 0.5 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                        {fact.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {fact.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default KeyFacts
