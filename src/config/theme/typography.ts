import { TypographyOptions } from '@mui/material/styles/createTypography'

export const fontFamily = [
  '"Outfit"',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

const typography: TypographyOptions = {
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 800,
  h1: {
    fontSize: 56,
    lineHeight: 1.1,
    fontWeight: 800,
  },
  h2: {
    fontSize: 40,
    lineHeight: 1.15,
    fontWeight: 800,
  },
  h3: {
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 800,
  },
  h4: {
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 700,
  },
  h5: {
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 700,
  },
  h6: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  body2: {
    fontSize: '0.9rem',
    lineHeight: 1.65,
  },
  subtitle1: {
    fontSize: '0.85rem',
  },
  subtitle2: {
    fontSize: '0.8rem',
  },
}

export default typography
