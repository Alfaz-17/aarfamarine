import React, { useState, useEffect, FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { Send } from 'lucide-react'

interface CompactInquiryFormProps {
  source: string
  defaultMessage?: string
  title?: string
  subtitle?: string
  isModal?: boolean
  onSuccess?: () => void
}

export const CompactInquiryForm: FC<CompactInquiryFormProps> = ({ 
  source, 
  defaultMessage = '',
  title = "Quick Inquiry",
  subtitle = "Have a question or need a quote? Drop us a message and our team will get back to you shortly.",
  isModal = false,
  onSuccess
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: defaultMessage })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (defaultMessage) {
      setFormData(prev => ({ ...prev, message: defaultMessage }))
    }
  }, [defaultMessage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source }),
      })

      if (!res.ok) {
        throw new Error('Failed to send inquiry')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000) // Close modal after 2 seconds
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      p: isModal ? 4 : 4, 
      borderRadius: isModal ? 0 : 2, 
      boxShadow: isModal ? 'none' : '0 10px 40px rgba(10,25,47,0.06)',
      border: isModal ? 'none' : '1px solid',
      borderColor: 'divider'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {subtitle}
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Thank you! Your inquiry has been sent successfully.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Company / Vessel (Optional)"
          name="company"
          value={formData.company}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Your Message"
          name="message"
          multiline
          rows={3}
          value={formData.message}
          onChange={handleChange}
          required
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
          sx={{
            py: 1.2,
            bgcolor: 'primary.main',
            color: 'common.white',
            fontWeight: 700,
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          {loading ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </Box>
  )
}
