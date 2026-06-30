import React, { FC } from 'react'
import Box from '@mui/material/Box'
// Removed react-scroll import as it's no longer used
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import type { Navigation as NavType } from '@/interfaces/navigation'
import { navigations } from './navigation.data'

interface NavigationProps {
  isScrolled?: boolean
  items?: NavType[]
  onNavigate?: () => void
}

const Navigation: FC<NavigationProps> = ({ isScrolled, items, onNavigate }) => {
  const router = useRouter()
  const activeItems = items || navigations

  const linkStyles = (isActive: boolean) => ({
    position: 'relative',
    color: isScrolled 
      ? (isActive ? 'primary.main' : 'text.secondary')
      : (isActive ? 'common.white' : 'rgba(255, 255, 255, 0.72)'),
    cursor: 'pointer',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: { xs: '100%', md: 'auto' },
    px: { xs: 2, md: 3 },
    py: { xs: 1, md: 1 },
    mb: { xs: 0.25, md: 0 },
    fontSize: { xs: '1rem', md: isScrolled ? '1rem' : '1.1rem' },
    textDecoration: 'none',
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: isScrolled ? 'primary.main' : 'common.white',
      '& .hover-curve': {
        display: 'block',
      },
    },
    '&.current': {
      color: isScrolled ? 'primary.main' : 'common.white',
      '& .hover-curve': {
        display: 'block',
      },
    },
  })


  const renderCurve = (showByDefault = false) => (
    <Box
      className="hover-curve"
      sx={{ position: 'absolute', bottom: 0,
        left: '50%',
        transform: 'translateX(-50%) rotate(2deg)',
        lineHeight: 0,
        pointerEvents: 'none',
        display: showByDefault ? 'block' : 'none',
        '& img': { width: 36, height: 'auto' },
      }}
    >
      <img src="/images/headline-curve.svg" alt="Headline curve" />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', width: { xs: '100%', md: 'auto' }, maxWidth: { xs: 360, md: 'none' } }}>
      {activeItems.map(({ path: destination, label, children }) => {
        const isActive = router.pathname === destination

        return (
          <Box key={destination} sx={{ position: 'relative', width: { xs: '100%', md: 'auto' }, '&:hover .dropdown-menu': { display: 'block', opacity: 1, transform: 'translateY(0)' } }}>
            <NextLink href={destination} passHref>
              <Box
                component="a"
                sx={linkStyles(isActive)}
                onClick={onNavigate}
              >
                {renderCurve(isActive)}
                {label}
                {children && <Box component="span" sx={{ ml: 0.5, fontSize: '0.7rem', opacity: 0.7 }}>▼</Box>}
              </Box>
            </NextLink>

            {children && (
              <Box
                className="dropdown-menu"
                sx={{
                  display: { xs: 'block', md: 'none' },
                  opacity: { xs: 1, md: 0 },
                  transform: { xs: 'none', md: 'translateY(10px)' },
                  position: { xs: 'static', md: 'absolute' },
                  top: '100%',
                  left: { xs: '50%', md: 0 },
                  transformOrigin: 'top',
                  minWidth: { md: 220 },
                  width: { xs: '100%', md: 'auto' },
                  bgcolor: { xs: 'rgba(30,95,166,0.06)', md: 'background.paper' },
                  boxShadow: { xs: 'none', md: '0 10px 40px rgba(0,0,0,0.15)' },
                  borderRadius: 1,
                  py: { xs: 0.5, md: 1.5 },
                  mb: { xs: 0.75, md: 0 },
                  zIndex: 999,
                  border: { xs: '1px solid rgba(30,95,166,0.08)', md: '1px solid rgba(0,0,0,0.05)' },
                  transition: 'all 0.3s ease',
                }}
              >
                {children.map((child, idx) => (
                  <NextLink key={idx} href={child.path} passHref>
                    <Box
                      component="a"
                      onClick={onNavigate}
                      sx={{
                        display: 'block',
                        px: 3,
                        py: { xs: 1, md: 1.5 },
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: { xs: '0.86rem', md: '0.95rem' },
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(30,95,166,0.05)',
                          color: 'primary.main',
                          pl: 4,
                          borderLeft: '4px solid',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      {child.label}
                    </Box>
                  </NextLink>
                ))}
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default Navigation
