import React, { FC } from 'react'
import Box from '@mui/material/Box'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  isScrolled?: boolean
}

const Logo: FC<Props> = ({ onClick, isScrolled }) => {
  const logoWidth = { xs: isScrolled ? 60 : 75, sm: isScrolled ? 65 : 85, md: isScrolled ? 70 : 110 }

  return (
    <Box onClick={onClick} sx={{ 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <Box
        component="img"
        src="/aarfa-logo.png"
        alt="Aarfa Marine Logo"
        sx={{
          display: 'block',
          width: logoWidth,
          height: 'auto',
          maxHeight: { xs: 72, sm: 78, md: 82 },
          objectFit: 'contain',
          transition: 'all 0.3s ease-in-out',
        }}
      />
    </Box>
  )
}



Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
