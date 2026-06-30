import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InventoryIcon from '@mui/icons-material/Inventory'
import BuildIcon from '@mui/icons-material/Build'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import Image from 'next/image'

const defaultServices = [
  {
    title: 'Supply of Marine Equipment',
    desc: 'We supply a wide range of marine electronics — Navigation, Automation, and Communication equipment — sourced from trusted brands and the Alang Shipbreaking Yard.',
    icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.light' }} />
  },
  {
    title: 'Installation & Commissioning',
    desc: 'Our trained engineers visit the vessel and handle complete installation and testing of all equipment. We have hands-on experience with Radar, ECDIS, AIS, Autopilot, GPS, VDR, Speed Log, Satellite Compass, NAVTEX, BNWAS, Echo Sounder, and more.',
    icon: <BuildIcon sx={{ fontSize: 40, color: 'primary.light' }} />
  },
  {
    title: 'After-Sales Service & Technical Support',
    desc: "We don't disappear after the sale. Our team provides ongoing technical support, troubleshooting, and service — and we keep engineers trained and current with the latest product updates and IMO requirements.",
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.light' }} />
  }
]

const getIcon = (idx: number) => {
  if (idx === 0) return <InventoryIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
  if (idx === 1) return <BuildIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
  return <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
}

interface WhatWeDoProps {
  data?: any
}

const WhatWeDo: FC<WhatWeDoProps> = ({ data }) => {
  const headline = data?.whatWeDoHeadline || "Our Three Core Solutions"
  const services = data?.whatWeDoServices || defaultServices

  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 }, 
      bgcolor: 'primary.dark',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient glows using primary.light */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(30,95,166,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(237,28,36,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          
          {/* LEFT SIDE: Image */}
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              position: 'relative', 
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
              height: { xs: 280, md: '100%' },
              minHeight: { md: 380 }
            }}>
              <Image src="/images/what-we-do.png" alt="Marine engineer installing navigation equipment" layout="fill" objectFit="cover" />
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10,25,47,0.8) 0%, transparent 100%)', pointerEvents: 'none' }} />
            </Box>
          </Grid>

          {/* RIGHT SIDE: Title + Cards */}
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 3, md: 3 } }}>
              <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                What We Do
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, fontWeight: 700, color: 'common.white', position: 'relative', display: 'inline-block' }}>
                <div dangerouslySetInnerHTML={{ __html: headline.replace('Solutions', '<span style="position:relative;display:inline-block;padding-bottom:12px;">Solutions<div style="position:absolute;bottom:0px;left:0;z-index:-1"><img src="/images/headline-curve.svg" alt="Headline curve" /></div></span>') }} />
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {services.map((item, idx) => (
                <Grid item xs={12} key={idx}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.02)', 
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: 2, 
                    p: { xs: 2, md: 2.5 },
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, md: 3 },
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      '& .accent-bar': {
                        opacity: 1
                      },
                      '& .icon-wrapper': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: 'primary.main',
                        borderColor: 'secondary.main'
                      },
                      '& .icon': {
                        color: 'secondary.main'
                      }
                    }
                  }}>
                    {/* Accent Left Bar using secondary color */}
                    <Box className="accent-bar" sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, bgcolor: 'secondary.main', opacity: 0, transition: 'opacity 0.4s ease' }} />

                    <Box className="icon-wrapper" sx={{ 
                      flexShrink: 0,
                      width: { xs: 45, md: 55 }, height: { xs: 45, md: 55 }, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(255,255,255,0.03)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.4s ease',
                    }}>
                      {React.cloneElement((item.icon || getIcon(idx)) as React.ReactElement, { className: 'icon', sx: { fontSize: 26, color: 'primary.light', transition: 'color 0.4s ease' } })}
                    </Box>
                    
                    <Box>
                      <Typography variant="h4" sx={{ color: 'common.white', mb: 0.5, fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' }, letterSpacing: 0 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontSize: { xs: '0.8rem', md: '0.85rem' } }}>
                        {item.description || item.desc}
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

export default WhatWeDo
