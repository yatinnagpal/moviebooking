import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import API from '../api';
import MovieCard from '../components/MovieCard';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showShowtimes, setShowShowtimes] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [bookingForm, setBookingForm] = useState({});
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let mounted = true;
    async function loadMovies() {
      try {
        const res = await API.get('/movies/');
        if (mounted) setMovies(res.data);
      } catch (error) {
        console.log('Failed to load movies', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMovies();
    return () => (mounted = false);
  }, []);

  const filtered = movies.filter((m) =>
    (m.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (movie) => {
    setSelectedMovie(movie);
    setShowShowtimes(false);
  };

  const handleShowtimes = async (movie) => {
    try {
      const res = await API.get(`/showtimes/?movie_id=${movie.id}`);
      setShowtimes(res.data);
      setSelectedMovie(movie);
      setShowShowtimes(true);
    } catch (err) {
      console.log('Failed to load showtimes', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setShowShowtimes(false);
    setShowtimes([]);
    setBookingForm({});
    setFormData({});
  };

  const handleFormToggle = (showtimeId) => {
    setBookingForm((prev) => ({ ...prev, [showtimeId]: !prev[showtimeId] }));
    setFormData((prev) => ({ ...prev, [showtimeId]: { name: '', email: '', seats: 1 } }));
  };

  const handleInputChange = (showtimeId, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [showtimeId]: { ...prev[showtimeId], [name]: value },
    }));
  };

  const handleBook = async (st) => {
    const data = formData[st.id];
    if (!data?.name || !data?.email) {
      setSnackbar({ open: true, message: 'Please enter name and email', severity: 'warning' });
      return;
    }
    const seatsToBook = Number(data.seats);
    if (seatsToBook <= 0 || seatsToBook > st.seats_available) {
      setSnackbar({ open: true, message: 'Invalid number of seats', severity: 'warning' });
      return;
    }
    try {
      await API.post('/bookings/', {
        showtime: st.id,
        seats_booked: seatsToBook,
        user_name: data.name,
        user_email: data.email,
      });
      setShowtimes((prev) =>
        prev.map((s) =>
          s.id === st.id ? { ...s, seats_available: s.seats_available - seatsToBook } : s
        )
      );
      handleFormToggle(st.id);
      setSnackbar({ open: true, message: 'Booking confirmed! 🎉', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Booking failed!',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Search */}
      <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, mt: 4, flexWrap: 'wrap' }}
      >
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies by title..."
          size="small"
          variant="outlined"
          sx={{ flex: 1, minWidth: 400, maxWidth: 800 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {search ? (
                  <IconButton size="small" onClick={() => setSearch('')}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={() => setSearch('')}>
          Clear
        </Button>
      </Box>

      {/* Movie Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography>No movies found</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          {filtered.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard
                movie={movie}
                onView={() => handleView(movie)}
                onShowtimes={() => handleShowtimes(movie)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {selectedMovie && (
        <Box
          onClick={handleCloseModal}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: 2,
          }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: { xs: '100%', sm: 650 },
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 15,
              position: 'relative',
              background: 'linear-gradient(145deg, #fafafa, #e6f2ff)',
              p: 1,
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Movie Details */}
            {!showShowtimes && (
              <>
                <CardMedia
                  component="img"
                  image={
                    selectedMovie.poster_url || 'https://via.placeholder.com/400x600?text=No+Image'
                  }
                  alt={selectedMovie.title}
                  sx={{
                    height: 450,
                    objectFit: 'contain',
                    borderRadius: 3,
                    mb: 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    {selectedMovie.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
                    {selectedMovie.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        background: '#cce7ff',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      {selectedMovie.genre}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        background: '#e0e0e0',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      {selectedMovie.duration} mins
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        background: '#fff3cd',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      {selectedMovie.rating} ⭐
                    </Typography>
                  </Box>
                </CardContent>
              </>
            )}

            {/* Showtimes */}
            {showShowtimes && (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3, color: '#222' }}
                >
                  Showtimes for {selectedMovie.title}
                </Typography>

                {showtimes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: '#ff4d6d', fontWeight: 600 }}>
                      Oops! No showtimes available yet 🎬
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
                      Don't worry, the movie will be hitting the screens soon!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                      Stay tuned and come back to grab your tickets. 🍿
                    </Typography>
                  </Box>
                ) : (
                  showtimes.map((st) => (
                    <Card
                      key={st.id}
                      sx={{
                        mb: 2,
                        p: 2.5,
                        borderRadius: 3,
                        boxShadow: 6,
                        background:
                          st.seats_available > 0
                            ? 'linear-gradient(135deg, #ffffff, #e0f7fa)'
                            : 'linear-gradient(135deg, #f8d7da, #f5c2c7)',
                        border: st.seats_available <= 0 ? '1px solid #ff4d6d' : 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 12,
                        },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {st.hall_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        Date: {new Date(st.start_time).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        Seats: {st.seats_available}/{st.seats_total}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        Price: Rs {st.price_per_ticket}
                      </Typography>

                      {/* Booking Form */}
                      {bookingForm[st.id] ? (
                        <Card
                          sx={{
                            mt: 1.5,
                            p: 2,
                            borderRadius: 2,
                            background: '#fff',
                            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.01)' },
                          }}
                        >
                          <TextField
                            name="name"
                            label="Name"
                            size="small"
                            value={formData[st.id]?.name || ''}
                            onChange={(e) => handleInputChange(st.id, e)}
                          />
                          <TextField
                            name="email"
                            label="Email"
                            size="small"
                            value={formData[st.id]?.email || ''}
                            onChange={(e) => handleInputChange(st.id, e)}
                          />
                          <TextField
                            name="seats"
                            type="number"
                            label="Seats"
                            size="small"
                            inputProps={{ min: 1, max: st.seats_available }}
                            value={formData[st.id]?.seats || 1}
                            onChange={(e) => handleInputChange(st.id, e)}
                          />
                          <Button
                            variant="contained"
                            sx={{
                              mt: 1,
                              background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                              color: '#fff',
                              fontWeight: 600,
                              '&:hover': { background: 'linear-gradient(45deg, #00f2fe, #4facfe)' },
                            }}
                            onClick={() => handleBook(st)}
                          >
                            Confirm Booking
                          </Button>
                          <Button
                            variant="text"
                            sx={{ mt: 0.5, color: '#555' }}
                            onClick={() => handleFormToggle(st.id)}
                          >
                            Cancel
                          </Button>
                        </Card>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            mt: 1,
                            background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                            color: '#fff',
                            fontWeight: 600,
                            '&:hover': { background: 'linear-gradient(45deg, #00f2fe, #4facfe)' },
                          }}
                          onClick={() => handleFormToggle(st.id)}
                          disabled={st.seats_available <= 0}
                        >
                          {st.seats_available <= 0 ? 'Sold Out' : 'Book Now'}
                        </Button>
                      )}
                    </Card>
                  ))
                )}
              </Box>
            )}

            {/* Close Button */}
            <Button
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                minWidth: '35px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                color: '#333',
                fontWeight: 700,
                boxShadow: 4,
                fontSize: 16,
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              ✕
            </Button>
          </Card>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
