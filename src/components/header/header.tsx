import React, { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Logo } from '@/components/logo'
import { Navigation } from '@/components/navigation'
import { useTheme } from '@mui/material/styles'
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import WhatsApp from '@mui/icons-material/WhatsApp'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const [scrollState, setScrollState] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isScrolled = isHomePage ? scrollState : true

  useEffect(() => {
    const handleScroll = () => {
      setScrollState(window.scrollY > 20)
      
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Home', path: '/' },
    { 
      label: 'About Us', 
      path: '/about',
      children: [
        { label: 'Who We Are', path: '/about#who-we-are' },
        { label: 'Our Story', path: '/about#our-story' },
        { label: 'The Team', path: '/about#the-team' },
        { label: 'Why Choose Us', path: '/about#why-choose' },
      ]
    },
    { label: 'Services', path: '/services' },
    { 
      label: 'Products', 
      path: '/products',
      children: [
        { label: 'Navigation', path: '/products?category=Navigation' },
        { label: 'Automation', path: '/products?category=Automation' },
        { label: 'Communication', path: '/products?category=Communication' },
      ]
    },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Contact Us', path: '/contact' },
  ]

  return (
    <Box sx={{ 
      position: 'fixed',
      top: { xs: isScrolled ? 8 : 0, md: isScrolled ? 20 : 0 },
      left: 0,
      right: 0,
      zIndex: 999,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      px: { xs: 1, sm: 1.5, md: 4 },
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: '100%', // Full width inside the padding
        maxWidth: 1400,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        border: '2px solid',
        borderColor: isScrolled ? 'primary.dark' : 'transparent',
        borderRadius: isScrolled ? { xs: 2, md: 50 } : 0,
        boxShadow: isScrolled ? '0 12px 40px rgba(30, 95, 166, 0.15)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        py: { xs: 0.75, md: isScrolled ? 1.5 : 2 },
        px: { xs: 1, sm: 1.5, md: 4 },
      }}>
        {/* Desktop Navigation */}
        {!matchMobileView ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Logo isScrolled={isScrolled} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Navigation isScrolled={isScrolled} items={links} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                component="a" 
                href="https://www.ebay.com/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <img src="/images/ebay.png" alt="eBay" style={{ height: '24px', width: '24px', objectFit: 'contain', borderRadius: '4px' }} />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.indiamart.com/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <img src="/images/indiamart.png" alt="IndiaMART" style={{ height: '24px', width: '24px', objectFit: 'contain', borderRadius: '4px' }} />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://wa.me/1234567890" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: isScrolled ? '#25D366' : '#25D366', // WhatsApp Brand Color
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <WhatsApp />
              </IconButton>
            </Box>
          </Box>
        ) : (
          /* Mobile Navigation (Centered Logo, Left Hamburguer trigger) */
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', minHeight: { xs: 66, sm: 76 } }}>
            <IconButton 
              onClick={() => setVisibleMenu(!visibleMenu)} 
              size="small"
              sx={{ color: isScrolled ? 'text.primary' : 'common.white', width: 40, height: 40 }}
            >
              <Menu />
            </IconButton>
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Logo isScrolled={isScrolled} />
            </Box>
            <Box sx={{ width: 40 }} /> {/* Spacing spacer to balance flex box */}

            {/* Mobile Navigation Drawer */}
            {visibleMenu && (
              <Box
                sx={{
                  py: 3,
                  px: { xs: 2, sm: 4 },
                  backgroundColor: 'background.paper',
                  zIndex: 'appBar',
                  position: 'fixed',
                  height: '100dvh',
                  width: '100%',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflowY: 'auto',
                }}
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                  }}
                  onClick={() => setVisibleMenu(false)}
                >
                  <Close />
                </IconButton>
                <Box sx={{ mb: 2.5, mt: 1 }}>
                  <Logo isScrolled={true} />
                </Box>
                <Navigation isScrolled={true} items={links} onNavigate={() => setVisibleMenu(false)} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Header
