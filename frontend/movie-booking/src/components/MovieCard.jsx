import React from 'react';
import { CardMedia, Typography, CardActions, Button, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, onView, onShowtimes }) {
  const navigate = useNavigate();
  const poster = movie.poster_url || 'https://via.placeholder.com/400x600?text=No+Image';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 345,
        height: '100%', // ✅ ensures card stretches to fill grid item
      }}
    >
      <CardMedia
        component="img"
        image={poster}
        alt={movie.title}
        sx={{
          height: 400, // ✅ fixed poster height
          objectFit: 'cover',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1, // ✅ makes content take remaining space
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom noWrap>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Typography variant="caption" sx={{ background: '#eef', px: 1, borderRadius: 1 }}>
              {movie.genre}
            </Typography>
            <Typography variant="caption" sx={{ background: '#f3f3f3', px: 1, borderRadius: 1 }}>
              {movie.duration} mins
            </Typography>
            <Typography variant="caption" sx={{ background: '#fff7e6', px: 1, borderRadius: 1 }}>
              {movie.rating} ⭐
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.description}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button size="small" onClick={onView}>
          View
        </Button>
        <Button size="small" onClick={onShowtimes}>
          Showtimes
        </Button>
      </CardActions>
    </Card>
  );
}
