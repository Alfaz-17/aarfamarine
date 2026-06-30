import React, { FC } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinkedIn from '@mui/icons-material/LinkedIn'
import WhatsApp from '@mui/icons-material/WhatsApp'

const SocialLinks: FC = () => {
  return (
    <Box sx={{ ml: -1, display: 'flex', gap: 1 }}>
      <IconButton 
        component="a" 
        href="https://www.ebay.com/usr/aarfa_marine" 
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ '&:hover': { opacity: 0.8 }, backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <img src="/images/ebay.png" alt="eBay" style={{ height: '22px', width: '22px', objectFit: 'contain', borderRadius: '4px' }} />
      </IconButton>

      <IconButton 
        component="a" 
        href="https://www.linkedin.com/in/aarfa-marine-25120b335/" 
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ 
          color: '#0A66C2',
          backgroundColor: 'rgba(255,255,255,0.05)',
          '&:hover': { backgroundColor: 'rgba(10, 102, 194, 0.2)' }
        }}
      >
        <LinkedIn fontSize="small" />
      </IconButton>

      <IconButton 
        component="a" 
        href="https://wa.me/918347471248" 
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ 
          color: '#25D366',
          backgroundColor: 'rgba(255,255,255,0.05)',
          '&:hover': { backgroundColor: 'rgba(37, 211, 102, 0.2)' }
        }}
      >
        <WhatsApp fontSize="small" />
      </IconButton>
    </Box>
  )
}

export default SocialLinks
