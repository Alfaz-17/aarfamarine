import React from 'react'
import Head from 'next/head'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import PageHero from '@/components/page-hero'
import { ProjectsSection, BrandsSection, CtaBand } from '@/components/home'

const Projects: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Our Projects | Aarfa Marine</title>
        <meta name="description" content="Aarfa Marine - View our recent installations, refits, and marine navigation projects." />
      </Head>

      <PageHero 
        title="Trusted Projects" 
        subtitle="Explore our recent work where we've supplied, installed, and commissioned advanced navigation systems for global fleets."
        image="/images/bridge-nav.jpg"
      />

      <ProjectsSection />

      <CtaBand tone="dark" />

      <BrandsSection />
    </>
  )
}

Projects.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default Projects
