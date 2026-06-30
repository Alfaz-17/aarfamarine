import { PaletteOptions } from '@mui/material'
import { grey, common } from '@mui/material/colors'

const palette: PaletteOptions = {
  mode: 'light',
  background: {
    default: '#F5F7FA',
    paper: common.white,
  },
  text: {
    primary: '#0A1F40',
    secondary: '#5F6F84',
    disabled: grey[500],
  },
  divider: '#DDE5EF',
}

export default palette
