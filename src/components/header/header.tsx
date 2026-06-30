import React, { FC, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Logo } from '@/components/logo'
import { Navigation } from '@/components/navigation'
import { useTheme } from '@mui/material/styles'
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import WhatsApp from '@mui/icons-material/WhatsApp'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const [scrollState, setScrollState] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isScrolled = isHomePage ? scrollState : true

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch search results automatically when typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(() => {
      setIsSearching(true)
      fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data || [])
          setIsSearching(false)
        })
        .catch(() => setIsSearching(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setScrollState(window.scrollY > 20)
      
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
    { label: 'Gallery', path: '/gallery' },
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
        width: '100%',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 1.5, lg: 2 } }}>
              
              {/* Compact Search Bar with Fast Typeahead */}
              <Box 
                ref={searchContainerRef}
                sx={{ 
                  position: 'relative',
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: isScrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)', 
                  borderRadius: 50, 
                  px: 1.5, 
                  py: 0.5, 
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.2)',
                  '&:focus-within': {
                    backgroundColor: isScrolled ? 'common.white' : 'rgba(255,255,255,0.2)',
                    borderColor: 'primary.main',
                    boxShadow: isScrolled ? '0 0 0 2px rgba(30, 95, 166, 0.1)' : '0 0 0 2px rgba(255,255,255,0.3)'
                  }
                }}
              >
                <SearchIcon sx={{ color: isScrolled ? 'text.secondary' : 'white', fontSize: 18 }} />
                <InputBase 
                  placeholder="Fast search..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowResults(true)
                  }}
                  onFocus={() => { if (searchQuery.trim()) setShowResults(true) }}
                  onKeyDown={handleSearch}
                  sx={{ 
                    ml: 1, 
                    width: { md: 80, lg: 100 }, 
                    transition: 'width 0.3s ease', 
                    '&:focus-within': { width: { md: 160, lg: 220 } }, 
                    color: isScrolled ? 'text.primary' : 'white', 
                    fontSize: '0.85rem',
                    '& input::placeholder': {
                      color: isScrolled ? 'text.secondary' : 'rgba(255,255,255,0.7)',
                      opacity: 1
                    }
                  }} 
                />

                {/* Search Results Dropdown */}
                {showResults && searchQuery.trim() && (
                  <Paper 
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      mt: 1.5,
                      width: { xs: 240, md: 280, lg: 320 },
                      maxHeight: 380,
                      overflowY: 'auto',
                      zIndex: 1000,
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      overflow: 'hidden'
                    }}
                  >
                    {isSearching ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Searching catalog...</Typography>
                      </Box>
                    ) : searchResults.length > 0 ? (
                      <List disablePadding>
                        {searchResults.map((product) => (
                          <ListItem 
                            key={product._id} 
                            onClick={() => {
                              setShowResults(false)
                              setSearchQuery('')
                              router.push(`/products/${product._id}`)
                            }}
                            sx={{ 
                              borderBottom: '1px solid', 
                              borderColor: 'divider', 
                              '&:last-child': { borderBottom: 'none' },
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              '&:hover': { backgroundColor: 'action.hover' }
                            }}
                          >
                            {product.images && product.images.length > 0 ? (
                              <Box component="img" src={product.images[0]} sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, mr: 1.5 }} />
                            ) : (
                              <Box sx={{ width: 44, height: 44, backgroundColor: 'grey.100', borderRadius: 1, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <SearchIcon color="disabled" fontSize="small" />
                              </Box>
                            )}
                            <ListItemText 
                              primary={product.name} 
                              secondary={product.category?.name || 'Equipment'}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 600, noWrap: true }}
                              secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">No products found</Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  component="a" 
                  href="https://www.ebay.com/usr/aarfa_marine" 
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ '&:hover': { opacity: 0.8 } }}
                >
                  <img src="/images/ebay.png" alt="eBay" style={{ height: '22px', width: '22px', objectFit: 'contain', borderRadius: '4px' }} />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://www.indiamart.com/aarfa-marine-gujarat/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ '&:hover': { opacity: 0.8 } }}
                >
                  <img src="/images/indiamart.png" alt="IndiaMART" style={{ height: '22px', width: '22px', objectFit: 'contain', borderRadius: '4px' }} />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://wa.me/1234567890" 
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ 
                    color: '#25D366',
                    backgroundColor: isScrolled ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255,255,255,0.1)',
                    '&:hover': { opacity: 0.8, backgroundColor: isScrolled ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <WhatsApp fontSize="small" />
                </IconButton>
              </Box>
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
