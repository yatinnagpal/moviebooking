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
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import API from '../api';
import { Link } from 'react-router-dom';

export default function MovieDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editMovieId, setEditMovieId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
    description: '',
    poster_url: '',
  });

  // ✅ Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ Fetch movies
  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies/');
      setMovies(res.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      showSnackbar('Failed to fetch movies!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ✅ Delete Movie
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await API.delete(`/movies/${id}/`);
        setMovies((prev) => prev.filter((m) => m.id !== id));
        showSnackbar('Movie deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting movie:', error);
        showSnackbar('Failed to delete movie!', 'error');
      }
    }
  };

  // ✅ Edit Movie
  const handleEdit = (movie) => {
    setEditMovieId(movie.id);
    setEditFormData({ ...movie });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editMovieId) setEditFormData((prev) => ({ ...prev, [name]: value }));
    else setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditMovieId(null);
    setEditFormData({});
  };

  // ✅ Save Updated Movie
  const handleSave = async (id) => {
    try {
      const res = await API.put(`/movies/${id}/`, editFormData);
      setMovies((prev) => prev.map((m) => (m.id === id ? res.data : m)));
      setEditMovieId(null);
      showSnackbar('Movie updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating movie:', error);
      showSnackbar('Failed to update movie!', 'error');
    }
  };

  // ✅ Add New Movie
  const handleAddMovie = async () => {
    try {
      const res = await API.post('/movies/', newMovie);
      setMovies((prev) => [...prev, res.data]);
      setOpenAddDialog(false);
      setNewMovie({
        title: '',
        genre: '',
        duration: '',
        rating: '',
        description: '',
        poster_url: '',
      });
      showSnackbar('Movie added successfully!', 'success');
    } catch (error) {
      console.error('Error adding movie:', error);
      showSnackbar('Failed to add movie!', 'error');
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading)
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading movies...
        </Typography>
      </Stack>
    );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          🎬 Movie Dashboard
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
          Add Movie
        </Button>
      </Stack>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Poster</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell>Showtimes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie) => (
              <TableRow hover key={movie.id}>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={movie.poster_url || 'https://via.placeholder.com/80x100?text=No+Image'}
                    alt={movie.title}
                    sx={{ width: 60, height: 80 }}
                  />
                </TableCell>

                {editMovieId === movie.id ? (
                  <>
                    <TableCell>
                      <TextField
                        name="title"
                        value={editFormData.title || ''}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="genre"
                        value={editFormData.genre || ''}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="duration"
                        type="number"
                        value={editFormData.duration || ''}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="rating"
                        type="number"
                        value={editFormData.rating || ''}
                        onChange={handleChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="description"
                        value={editFormData.description || ''}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/showtimes/${movie.id}`} // navigate to showtime page
                      >
                        View Showtimes
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>{movie.genre}</TableCell>
                    <TableCell>{movie.duration}</TableCell>
                    <TableCell>{movie.rating}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {movie.description}
                    </TableCell>
                  </>
                )}

                <TableCell align="center">
                  {editMovieId === movie.id ? (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSave(movie.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(movie)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(movie.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="text"
                    color="primary"
                    component={Link}
                    to={`/showtimes/${movie.id}`} // navigate to showtime page
                  >
                    View Showtimes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            background: 'linear-gradient(145deg, #fdfbfb 0%, #ebedee 100%)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            textAlign: 'center',
            mb: 1,
          }}
        >
          🎬 Add New Movie
        </DialogTitle>

        <DialogContent
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 3,
            mt: 1,
            alignItems: 'center',
          }}
        >
          {/* Left Section - Form Fields */}
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={newMovie.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Genre"
              name="genre"
              value={newMovie.genre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Duration (mins)"
              name="duration"
              type="number"
              value={newMovie.duration}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Rating"
              name="rating"
              type="number"
              value={newMovie.rating}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Poster URL"
              name="poster_url"
              value={newMovie.poster_url}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          {/* Right Section - Description + Poster Preview */}
          <Stack spacing={2} alignItems="center">
            <TextField
              label="Description"
              name="description"
              value={newMovie.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={5}
            />

            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Poster Preview
            </Typography>
            <img
              src={
                newMovie.poster_url
                  ? newMovie.poster_url
                  : 'https://via.placeholder.com/200x300?text=No+Poster'
              }
              alt="Movie Poster"
              style={{
                width: 200,
                height: 300,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                objectFit: 'cover',
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mt: 1 }}>
          <Button
            onClick={() => setOpenAddDialog(false)}
            variant="outlined"
            color="secondary"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMovie}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
              boxShadow: '0px 4px 10px rgba(33,150,243,0.3)',
              '&:hover': {
                background: 'linear-gradient(90deg, #1e88e5 0%, #00bcd4 100%)',
              },
            }}
          >
            Add Movie
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
