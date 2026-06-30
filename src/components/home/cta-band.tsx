import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

interface CtaBandProps {
  tone?: 'light' | 'dark'
}

const CtaBand: FC<CtaBandProps> = ({ tone = 'light' }) => {
  const isDark = tone === 'dark'

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'primary.main' : 'background.default',
        py: { xs: 6, md: 6 },
        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(10,25,47,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', gap: 4 }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.72)' : 'primary.light', mb: 2 }}>
              Get Started
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.85rem', md: '2.5rem' }, color: isDark ? 'common.white' : 'text.primary', lineHeight: 1.18, maxWidth: 720 }}>
              Ready to upgrade your vessel's navigation systems with confidence?
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: isDark ? 'common.white' : 'primary.main',
              color: isDark ? 'primary.main' : 'common.white',
              py: 2,
              px: 5,
              borderRadius: 1,
              fontWeight: 700,
              letterSpacing: 0,
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: isDark ? 'grey.100' : 'primary.light',
              },
            }}
          >
            Request Consult
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default CtaBand
