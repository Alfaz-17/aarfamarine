import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const projects = [
  {
    title: 'Bridge Navigation Retrofit',
    desc: 'Supply and commissioning support for radar, AIS, GPS, and bridge navigation equipment.',
  },
  {
    title: 'Communication Equipment Supply',
    desc: 'Marine communication systems, spares, and replacement units sourced for operational vessels.',
  },
  {
    title: 'Automation Spares Support',
    desc: 'Automation components and technical support for vessel maintenance teams and marine operators.',
  },
]

const ProjectsSection: FC = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {projects.map((project) => (
            <Grid item xs={12} md={4} key={project.title}>
              <Box
                sx={{
                  height: '100%',
                  bgcolor: 'common.white',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: { xs: 3, md: 4 },
                  boxShadow: '0 10px 28px rgba(10,31,64,0.06)',
                }}
              >
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 800, mb: 1.5 }}>
                  {project.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {project.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default ProjectsSection
