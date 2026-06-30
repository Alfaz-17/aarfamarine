import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { data } from './feature.data'

const HomeFeature: FC = () => {
  return (
    <Box id="about" sx={{ py: { xs: 10, md: 14 }, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
      <Container>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
              <Typography
                component="h2"
                sx={{
                  position: 'relative',
                  fontSize: { xs: 32, md: 40 },
                  mt: 2,
                  mb: 3,
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                }}
              >
                About{' '}
                <Typography
                  component="mark"
                  sx={{
                    position: 'relative',
                    color: 'secondary.main',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    backgroundColor: 'unset',
                  }}
                >
                  Aarfa Marine
                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 20, md: 28 },
                      transform: 'rotate(3deg)',
                      left: 2,
                      '& img': { width: { xs: 140, md: 175 }, height: 'auto' },
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/headline-curve.svg" alt="Headline curve" />
                  </Box>
                </Typography>
              </Typography>

              <Typography sx={{ color: 'primary.contrastText', opacity: 0.9, mb: 2, fontSize: '1.1rem' }}>
                Founded in 2018, Aarfa Marine is an Indian-based Marine Navigation & Communication Equipment Company. We are expert suppliers of marine navigation spare parts with a wide range of marine products.
              </Typography>
              <Typography sx={{ color: 'primary.contrastText', opacity: 0.9, mb: 2, fontSize: '1.1rem' }}>
                Under the leadership of Mr. Afzal (Managing Director), an engineer in marine electronics since 2014 with over 13+ years of expertise, we have grown to be a trusted partner in marine navigation.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 32, md: 40 },
                mb: 4,
                lineHeight: 1.2,
                fontWeight: 'bold',
              }}
            >
              Why Choose Us
            </Typography>

            <Grid container spacing={2}>
              {data.map(({ title, description, icon }, index) => (
                <Grid key={String(index)} item xs={12} md={6}>
                  <Box sx={{ 
                    px: 2, 
                    py: 2.5, 
                    boxShadow: 1, 
                    borderRadius: 4, 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    height: '100%', 
                    backgroundColor: 'background.paper',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }
                  }}>
                    <Box
                      sx={{
                        mr: 2,
                        backgroundColor: 'secondary.main',
                        borderRadius: '50%',
                        height: 48,
                        width: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.contrastText',
                        flexShrink: 0,
                        '& svg': {
                          fontSize: 28,
                        },
                      }}
                    >
                      {icon}
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, color: 'secondary.main', fontWeight: 'bold' }}>
                        {title}
                      </Typography>
                      <Typography sx={{ lineHeight: 1.4, color: 'text.secondary' }} variant="subtitle1">
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HomeFeature
