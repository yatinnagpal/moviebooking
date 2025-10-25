import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import API from '../api';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching movie', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {movie.title}
      </Typography>
      <img src={movie.poster_url} alt={movie.title} width="300" />
      <Typography sx={{ mt: 2 }}>{movie.description}</Typography>
      <Typography>Genre: {movie.genre}</Typography>
      <Typography>Duration: {movie.duration} mins</Typography>
      <Typography>Rating: {movie.rating} ⭐</Typography>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => navigate(`/movies/${movie.id}/showtimes`)}
        >
          View Showtimes
        </Button>
      </Box>
    </Box>
  );
}
