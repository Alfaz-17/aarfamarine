import React, { ReactNode } from 'react'
import MemoryIcon from '@mui/icons-material/Memory'
import PublicIcon from '@mui/icons-material/Public'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

interface Data {
  title: string
  description: string
  icon?: ReactNode
}

export const data: Data[] = [
  {
    title: 'Advanced Technology',
    description: 'Efficient, reliable, sustainable marine solutions',
    icon: <MemoryIcon />,
  },
  {
    title: 'Export Worldwide',
    description: 'Global export of advanced marine electronics',
    icon: <PublicIcon />,
  },
  {
    title: 'Quality Assurance',
    description: 'Products sourced from Alang shipbreaking yard',
    icon: <VerifiedUserIcon />,
  },
  {
    title: 'Timely Delivery',
    description: 'Spare parts delivered within 24 hours of order confirmation',
    icon: <LocalShippingIcon />,
  },
]
