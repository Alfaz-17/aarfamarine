import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

interface CtaBandProps {
  tone?: 'light' | 'dark'
}

const CtaBand: FC<CtaBandProps> = ({ tone = 'light' }) => {
  const isDark = tone === 'dark'

  return null
}

export default CtaBand
