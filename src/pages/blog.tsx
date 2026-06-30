import React from 'react'
import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import PageHero from '@/components/page-hero'

// Mock Blog Data
const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Future of GMDSS: What Fleet Managers Need to Know',
    date: 'March 15, 2024',
    category: 'Industry Insights',
    image: '/images/marine-radio.jpg',
    excerpt: 'Explore the upcoming regulatory changes and technological advancements in Global Maritime Distress and Safety Systems (GMDSS) affecting commercial shipping.'
  },
  {
    id: 2,
    title: 'Why Reconditioned Navigation Spares Make Sense',
    date: 'February 28, 2024',
    category: 'Best Practices',
    image: '/images/bridge-nav.jpg',
    excerpt: 'A deep dive into the cost-benefit analysis of using certified reconditioned spares versus new OEM parts for legacy vessel systems.'
  },
  {
    id: 3,
    title: 'Sourcing Marine Equipment from Alang: A Guide',
    date: 'January 10, 2024',
    category: 'Company News',
    image: '/images/why-choose-us.jpg',
    excerpt: 'How Aarfa Marine leverages its proximity to the world\'s largest ship recycling yard to provide high-quality, tested marine electronics globally.'
  }
]

const Blog: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Maritime Blog & News | Aarfa Marine</title>
        <meta name="description" content="Read the latest insights, news, and technical articles on marine navigation and communication systems." />
      </Head>

      <PageHero 
        title="Maritime Insights & News" 
        subtitle="Stay updated with the latest industry trends, technical guides, and Aarfa Marine company news."
        image="/images/marine-bridge.jpg"
      />

      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.paper', minHeight: '60vh' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {BLOG_POSTS.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 22px 50px rgba(10,31,64,0.14)' } }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: { xs: 190, md: 200 },
                      backgroundImage: `url(${post.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase' }}>
                        {post.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, lineHeight: 1.35 }}>
                      {post.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                      {post.excerpt}
                    </Typography>
                    <Button variant="text" sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 0 }}>
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

Blog.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default Blog
