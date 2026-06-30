import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/admin-layout';
import { useAdminCache } from '@/hooks/use-admin-cache';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Eye, Mail, Phone, Calendar } from 'lucide-react';
import { MarineLoader } from '@/components/common/marine-loader';

export default function AdminInquiries() {
  const { data, isLoading } = useAdminCache<any[]>('/inquiries');
  const inquiries = data || [];
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);



  const handleOpenDialog = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Inquiries | Aarfa Marine Admin</title>
      </Head>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A1F40' }}>
          Customer Inquiries
        </Typography>
      </Box>

      {isLoading ? (
        <MarineLoader />
      ) : inquiries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No inquiries found.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                      <Calendar size={14} />
                      {formatDate(inquiry.createdAt)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{inquiry.name}</Typography>
                    {inquiry.company && (
                      <Typography variant="caption" color="text.secondary">{inquiry.company}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
                        <Mail size={14} className="text-slate-400" />
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email}</a>
                      </Box>
                      {inquiry.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
                          <Phone size={14} className="text-slate-400" />
                          <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">{inquiry.phone}</a>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={inquiry.source || 'Website'} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(inquiry)} size="small">
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedInquiry && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2, fontWeight: 700 }}>
              Inquiry Details
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{selectedInquiry.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{formatDate(selectedInquiry.createdAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600">{selectedInquiry.email}</a>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{selectedInquiry.phone || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Company</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{selectedInquiry.company || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Source</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{selectedInquiry.source || 'Website'}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Message</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.message}</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #e2e8f0', p: 2 }}>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
}
