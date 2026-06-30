import React from 'react'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import StarIcon from '@mui/icons-material/Star'
import Image from 'next/image'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import { X as CloseIcon } from 'lucide-react'
import { GetStaticProps } from 'next'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import { SEO } from '@/components/seo/SEO'
import dynamic from 'next/dynamic'
const PageHero = dynamic(() => import('@/components/page-hero'))
import { CtaBand, WhyChoose, BrandsSection } from '@/components/home'
import connectToDatabase from '@/lib/db'
import { Brand } from '@/lib/models'

import { client, urlFor } from '@/lib/sanity'

interface AboutUsProps {
  brands: any[]
  teamMembers: any[]
}

const defaultTeam = [
  {
    name: 'Afjal Sarvaiya',
    role: 'Managing Director',
    description: 'Leading the vision and strategy for global maritime supply and services at Aarfa Marine.',
    phone: '+91 8160002323',
    initials: 'AS',
    isFounder: true,
  },
  {
    name: 'Fejal Gundigara',
    role: 'Operations Manager',
    description: 'Overseeing day-to-day operations, ensuring seamless global dispatch and logistics efficiency.',
    phone: '+91 8347471248',
    initials: 'FG',
    isFounder: false,
  },
  {
    name: 'Javed Deraiya',
    role: 'Service Engineer Manager',
    description: 'Managing technical teams, installations, and critical on-board equipment commissioning.',
    phone: '+91 8306161422',
    initials: 'JD',
    isFounder: false,
  },
  {
    name: 'Sahil Sarmali',
    role: 'Finance & Account Manager',
    description: 'Directing financial planning, accounting compliance, and corporate financial health.',
    phone: '+91 9081811248',
    initials: 'SS',
    isFounder: false,
  }
]

const AboutUs: NextPageWithLayout<AboutUsProps> = ({ brands, teamMembers }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const team = teamMembers?.length > 0 ? teamMembers : defaultTeam;
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about Aarfa Marine, a trusted supplier of marine navigation and automation equipment from the Alang Shipbreaking Yard since 2013."
        canonicalUrl="/about"
      />

      <PageHero 
        title="About Aarfa Marine" 
        subtitle="The Technical Room Specialists for the Global Maritime Fleet. Sourcing directly from Alang to supply certified navigation and automation systems."
        image="/images/about-bridge.png"
      />

      {/* SECTION 1: WHO WE ARE */}
      <Box id="who-we-are" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', height: { xs: 300, md: 450 }, cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => setLightboxImage('/images/office-outside.jpeg')}
              >
                <Image src="/images/office-outside.jpeg" alt="Aarfa Marine Office Outside" layout="fill" objectFit="cover" />
                {/* Brand color overlay */}
                <Box sx={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(to top right, rgba(10,31,64,0.6) 0%, rgba(30,95,166,0.2) 100%)',
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none'
                }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>

              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, mb: 3, color: 'text.primary', position: 'relative', display: 'inline-block' }}>
                We Are Aarfa Marine
                <Box sx={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%) rotate(2deg)', '& img': { width: { xs: 70, md: 90 }, opacity: 0.9 }, zIndex: -1 }}>
                  <img src="/images/headline-curve.svg" alt="Headline curve" />
                </Box>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
                Aarfa Marine is a Bhavnagar, Gujarat-based company that supplies, installs, and services marine navigation, communication, and automation equipment. We work with ship owners, ship managers, shipping companies, and maritime businesses across India and worldwide.
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Our products cover everything a vessel needs — from Gyro Compasses and Marine Radars to Engine Alarm Systems and Temperature Controllers. We stock products from more than 18 leading international brands and can deliver anywhere in the world within 24 hours.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 2: OUR STORY & MISSION */}
      <Box id="our-story" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#051021', color: 'common.white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center" direction="row-reverse">
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', height: { xs: 300, md: 450 }, cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => setLightboxImage('/images/about-workshop.png')}
              >
                <Image src="/images/about-workshop.png" alt="Our Story" layout="fill" objectFit="cover" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>

              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, mb: 3 }}>
                How It All Started
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
                Aarfa Marine was established in 2018 by Mr. Afzal, who began his career as a marine electronics engineer in 2014. After years of working on ships and understanding exactly what equipment vessels need — and how hard it is to get reliable spare parts quickly — he started Aarfa Marine with one goal: make quality marine electronics easy to get, at fair prices, fast.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Today, the company operates from Bhavnagar — home to the world-famous Alang Shipbreaking Yard — which gives us a unique advantage in sourcing genuine, tested marine equipment at competitive prices.
              </Typography>
              
              <Box sx={{ borderLeft: '4px solid #1E5FA6', pl: 3, py: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Our Mission</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>
                  To be the most trusted supplier of marine equipment by stocking genuine tested parts, delivering within 24 hours, providing expert advice, and giving honest, transparent pricing.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 3: THE TEAM */}
      <Box id="the-team" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'text.primary' }}>
              Meet the People Behind Aarfa Marine
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {team.map((member: any, idx: number) => {
              const isFounder = member.isFounder || member.role?.toLowerCase().includes('founder') || member.role?.toLowerCase().includes('managing director');
              const initials = member.initials || member.name.split(' ').map((n: string) => n[0]).join('');
              
              if (isFounder) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Box sx={{ 
                      textAlign: 'center', p: 3, 
                      border: '2px solid', borderColor: 'primary.main', 
                      borderRadius: 2, height: '100%', 
                      background: 'linear-gradient(180deg, rgba(30,95,166,0.05) 0%, rgba(255,255,255,1) 100%)',
                      position: 'relative',
                      boxShadow: '0 8px 24px rgba(30,95,166,0.15)',
                      transition: 'all 0.3s', 
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(30,95,166,0.25)' } 
                    }}>
                      <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'primary.main', color: 'white', px: 2, py: 0.5, borderRadius: 5, fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        Founder
                      </Box>
                      <Avatar sx={{ width: 90, height: 90, mx: 'auto', mt: 1, mb: 2.5, bgcolor: 'primary.main', fontSize: '1.8rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(30,95,166,0.4)' }}>{initials}</Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary', fontSize: '1.25rem' }}>{member.name}</Typography>
                      <Typography sx={{ color: 'primary.main', fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>{member.role}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.5, mb: 2 }}>
                        {member.description}
                      </Typography>
                    </Box>
                  </Grid>
                )
              }
              
              const bgColors = ['primary.light', '#4caf50', 'secondary.main', '#ff9800', '#9c27b0'];
              const bgColor = bgColors[idx % bgColors.length];
              
              return (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box sx={{ textAlign: 'center', p: 3, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, height: '100%', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 30px rgba(10,25,47,0.08)', transform: 'translateY(-5px)' } }}>
                    <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2.5, bgcolor: bgColor, fontSize: '1.8rem', fontWeight: 600 }}>{initials}</Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary', fontSize: '1.25rem' }}>{member.name}</Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>{member.role}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.5, mb: 2 }}>
                      {member.description}
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      <WhyChoose />

      {/* SECTION 5: BRANDS */}
      <Box sx={{ py: 8 }}>
        <BrandsSection brands={brands} />
      </Box>


      <CtaBand tone="dark" />

      {/* Image Lightbox */}
      <Dialog 
        open={!!lightboxImage} 
        onClose={() => setLightboxImage(null)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', m: 0, p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } }}
      >
        <IconButton 
          onClick={() => setLightboxImage(null)} 
          sx={{ 
            position: 'fixed', 
            top: { xs: 16, md: 32 }, 
            right: { xs: 16, md: 32 }, 
            color: 'white', 
            bgcolor: 'rgba(0,0,0,0.7)', 
            border: '2px solid rgba(255,255,255,0.3)',
            width: 56,
            height: 56,
            zIndex: 9999,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: 'primary.main', borderColor: 'white', transform: 'scale(1.1)' } 
          }}
          aria-label="Close"
        >
          <CloseIcon size={32} />
        </IconButton>
        {lightboxImage && (
          <Box sx={{ position: 'relative', width: '90vw', height: '90vh' }}>
            <Image src={lightboxImage} alt="Enlarged view" layout="fill" objectFit="contain" />
          </Box>
        )}
      </Dialog>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    const [brands, teamMembers] = await Promise.all([
      Brand.find({}).lean(),
      client.fetch(`*[_type == "teamMember" && !(_id in path("drafts.**"))] | order(order asc)`).catch(() => [])
    ])
    
    return {
      props: {
        brands: JSON.parse(JSON.stringify(brands)),
        teamMembers,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: {
        brands: [],
        teamMembers: [],
      },
      revalidate: 60,
    }
  }
}

AboutUs.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default AboutUs
