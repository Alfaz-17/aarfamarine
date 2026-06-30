import React, { useState } from 'react'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import CloseIcon from '@mui/icons-material/Close'

const WhatsAppButton: React.FC = () => {
  const [open, setOpen] = useState(false)
  
  // Only toggle on click, ignore hover
  const handleClose = (_event: React.SyntheticEvent<{}>, reason: string) => {
    if (reason === 'mouseLeave') return
    setOpen(false)
  }

  const handleOpen = (_event: React.SyntheticEvent<{}>, reason: string) => {
    if (reason === 'mouseEnter') return
    setOpen(true)
  }

  const phoneNumber = '919081811248'
  const message = 'Hello! I am interested in your marine equipment and services.'
  
  const actions = [
    { icon: <WhatsAppIcon sx={{ fontSize: 28 }} />, name: 'WhatsApp', url: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, color: '#25D366', target: '_blank' },
    { icon: <PhoneIcon sx={{ fontSize: 26 }} />, name: 'Call Us', url: `tel:+919081811248`, color: '#00BFA5', target: '_self' },
    { icon: <EmailIcon sx={{ fontSize: 26 }} />, name: 'Email Us', url: `mailto:info@aarfamarine.com`, color: '#FF5252', target: '_self' },
  ]

  return (
    <SpeedDial
      ariaLabel="Contact Options"
      sx={{ 
        position: 'fixed', 
        bottom: { xs: 24, md: 32 }, 
        right: { xs: 24, md: 32 }, 
        zIndex: 9999 
      }}
      icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="up"
      FabProps={{
        sx: {
          bgcolor: '#5c6bc0', // The blue color from user's image
          width: { xs: 56, md: 64 },
          height: { xs: 56, md: 64 },
          boxShadow: '0 8px 24px rgba(92,107,192,0.4)',
          '&:hover': { 
            bgcolor: '#3f51b5',
            boxShadow: '0 12px 28px rgba(92,107,192,0.5)',
          },
          '& .MuiSpeedDialIcon-icon': { fontSize: { xs: 28, md: 32 } }
        }
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false); // Fixed: call setOpen directly instead of handleClose without args
            window.open(action.url, action.target);
          }}
          sx={{
            bgcolor: action.color,
            color: 'white',
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            mb: 1,
            boxShadow: `0 4px 12px ${action.color}66`,
            '&:hover': {
              bgcolor: action.color,
              filter: 'brightness(0.9)',
            },
            // Tooltip styling to make it look professional
            '& .MuiSpeedDialAction-staticTooltipLabel': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              px: 2,
              py: 0.75,
              borderRadius: 2,
              whiteSpace: 'nowrap'
            }
          }}
        />
      ))}
    </SpeedDial>
  )
}

export default WhatsAppButton
