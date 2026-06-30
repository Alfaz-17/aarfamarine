import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const WhyChoose: FC = () => {
  return (
    <Box id="why-choose" sx={{ minHeight: { xs: 'auto', md: 560 }, backgroundColor: 'background.paper', display: 'flex' }}>
      <Grid container>
        {/* Content Side */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: 'background.default',
              padding: { xs: '56px 20px', sm: '64px 32px', md: '80px 64px' },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 24, height: 2, bgcolor: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Why choose Aarfa Marine
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: 'text.primary', lineHeight: 1.18, mb: 2 }}>
              Your trusted marine partner<br />
              <Typography component="span" sx={{ color: 'primary.light', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', position: 'relative', display: 'inline-block' }}>
                in cost and compliance
                <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(2deg)', '& img': { width: { xs: 80, md: 100 }, opacity: 0.9 }, zIndex: -1 }}>
                  <img src="/images/headline-curve.svg" alt="Headline curve" />
                </Box>
              </Typography>
            </Typography>

            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 5 }}>
              Our team has built its reputation on reliability and accountability, taking on complex refit projects where the stakes are high and vessel downtime is not an option.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Item 1 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '14px', color: 'primary.light', minWidth: 24, fontWeight: 800 }}>
                  01
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Proven Compliance
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '13.5px', color: 'text.secondary', lineHeight: 1.65 }}>
                      Aligned with IMO, SOLAS, and global classification society requirements.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Item 2 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '14px', color: 'primary.light', minWidth: 24, fontWeight: 800 }}>
                  02
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Cost-Effective Spares
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '13.5px', color: 'text.secondary', lineHeight: 1.65 }}>
                      Directly sourced from Alang shipbreaking yard, thoroughly tested and certified.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Item 3 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '14px', color: 'primary.light', minWidth: 24, fontWeight: 800 }}>
                  03
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Technical Expertise
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '13.5px', color: 'text.secondary', lineHeight: 1.65 }}>
                      Engineers available 24/7 for troubleshooting and remote support.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Item 4 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '14px', color: 'primary.light', minWidth: 24, fontWeight: 800 }}>
                  04
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Global Shipping
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '13.5px', color: 'text.secondary', lineHeight: 1.65 }}>
                      Rapid dispatch ensuring your parts reach any port worldwide on time.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Image Side */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: { xs: 280, sm: 360, md: '100%' },
              backgroundColor: 'primary.main',
              backgroundImage: 'url(/images/why-choose-us.jpg)', // Placeholder
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Fallback gradient */}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,31,64,0.82) 0%, rgba(30,95,166,0.34) 100%)' }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default WhyChoose
