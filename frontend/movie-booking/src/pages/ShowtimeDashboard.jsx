import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Stack,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ShowtimeDashboard() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editData, setEditData] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [newShowtime, setNewShowtime] = useState({
    hall_name: '',
    start_time: '',
    seats_total: '',
    seats_available: '',
    price_per_ticket: '',
  });

  // ✅ Fetch showtimes
  const fetchShowtimes = async () => {
    try {
      const res = await API.get(`/showtimes/?movie_id=${movieId}`);
      setShowtimes(res.data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch showtimes.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, [movieId]);

  // ✅ Delete showtime
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this showtime?')) {
      try {
        await API.delete(`/showtimes/${id}/`);
        setShowtimes(showtimes.filter((s) => s.id !== id));
        setSnackbar({
          open: true,
          message: 'Showtime deleted successfully.',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error deleting showtime:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete showtime.',
          severity: 'error',
        });
      }
    }
  };

  // ✅ Edit logic
  const handleEditOpen = (showtime) => setEditData(showtime);
  const handleEditClose = () => setEditData(null);
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await API.put(`/showtimes/${editData.id}/`, editData);
      setShowtimes(showtimes.map((s) => (s.id === editData.id ? editData : s)));
      setSnackbar({
        open: true,
        message: 'Showtime updated successfully!',
        severity: 'success',
      });
      handleEditClose();
    } catch (error) {
      console.error('Error updating showtime:', error);
      const msg = error.response?.data?.__all__?.[0] || 'Error updating showtime.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  // ✅ Create logic
  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);
  const handleNewChange = (e) => {
    setNewShowtime({ ...newShowtime, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    try {
      const payload = { ...newShowtime, movie: movieId };
      const res = await API.post(`/showtimes/`, payload);
      setShowtimes([...showtimes, res.data]);
      setSnackbar({
        open: true,
        message: 'Showtime created successfully!',
        severity: 'success',
      });
      setCreateOpen(false); // ✅ Close on success
      setNewShowtime({
        hall_name: '',
        start_time: '',
        seats_total: '',
        seats_available: '',
        price_per_ticket: '',
      });
    } catch (error) {
      console.error('Error creating showtime:', error);
      const msg =
        error.response?.data?.__all__?.[0] || 'Error creating showtime. Please try again.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
      // ❌ Don’t close on error
    }
  };

  // ✅ Helper for formatting date/time
  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    return d.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading)
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading showtimes...
        </Typography>
      </Stack>
    );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin')}
          >
            Back to Movies
          </Button>
          <Typography variant="h5">🎟️ Showtimes for Movie ID: {movieId}</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleCreateOpen}>
          Add Showtime
        </Button>
      </Stack>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hall Name</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Total Seats</TableCell>
              <TableCell>Available Seats</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {showtimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No showtimes available for this movie.
                </TableCell>
              </TableRow>
            ) : (
              showtimes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.hall_name}</TableCell>
                  <TableCell>{formatDateTime(s.start_time)}</TableCell>
                  <TableCell>{s.seats_total}</TableCell>
                  <TableCell>{s.seats_available}</TableCell>
                  <TableCell>{s.price_per_ticket}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditOpen(s)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={showtimes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
      />

      {/* 🟢 Create Showtime Dialog */}
      <Dialog open={createOpen} onClose={handleCreateClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Showtime</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Hall Name"
              name="hall_name"
              value={newShowtime.hall_name}
              onChange={handleNewChange}
              fullWidth
            />
            <TextField
              label="Start Time"
              name="start_time"
              type="datetime-local"
              value={newShowtime.start_time}
              onChange={handleNewChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Total Seats"
              name="seats_total"
              type="number"
              value={newShowtime.seats_total}
              onChange={handleNewChange}
              fullWidth
            />
            <TextField
              label="Available Seats"
              name="seats_available"
              type="number"
              value={newShowtime.seats_available}
              onChange={handleNewChange}
              fullWidth
            />
            <TextField
              label="Price per Ticket (₹)"
              name="price_per_ticket"
              type="number"
              value={newShowtime.price_per_ticket}
              onChange={handleNewChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Create Showtime
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🟡 Edit Dialog */}
      <Dialog open={!!editData} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Showtime</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Hall Name"
              name="hall_name"
              value={editData?.hall_name || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Start Time"
              name="start_time"
              type="datetime-local"
              value={
                editData?.start_time ? new Date(editData.start_time).toISOString().slice(0, 16) : ''
              }
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Total Seats"
              name="seats_total"
              type="number"
              value={editData?.seats_total || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Available Seats"
              name="seats_available"
              type="number"
              value={editData?.seats_available || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Price per Ticket (₹)"
              name="price_per_ticket"
              type="number"
              value={editData?.price_per_ticket || ''}
              onChange={handleEditChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔔 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
