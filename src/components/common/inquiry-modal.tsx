import React, { FC } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { CompactInquiryForm } from './compact-inquiry-form'

interface InquiryModalProps {
  open: boolean
  onClose: () => void
  source: string
  defaultMessage?: string
  title?: string
  subtitle?: string
}

export const InquiryModal: FC<InquiryModalProps> = ({ 
  open, 
  onClose, 
  source, 
  defaultMessage,
  title = "Get Started",
  subtitle = "Ready to upgrade your vessel's navigation systems with confidence?"
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'visible', // To allow close button to potentially hang off edge
          position: 'relative'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
          zIndex: 10
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <DialogContent sx={{ p: 0 }}>
        {/* We pass a prop indicating we are in a modal to remove extra padding/borders if we want, 
            but for now we can just use the existing form and maybe override styles via a prop later. 
            For simplicity, we'll just pass title/subtitle to it if we update the form, 
            or we can just render the form inside without updating it.
            Wait, we need the form to render the custom title and subtitle. Let's update CompactInquiryForm. */}
        <CompactInquiryForm 
          source={source} 
          defaultMessage={defaultMessage} 
          title={title}
          subtitle={subtitle}
          isModal={true}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
