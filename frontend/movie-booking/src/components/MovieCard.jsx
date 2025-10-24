import React from 'react'
import {CardMedia, Typography, CardActions, Button, Box} from '@mui/material'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom'


export default function MovieCard({movie, onView, onShowtimes}){
      const navigate = useNavigate()
      const poster = movie.poster_url || 'https://via.placeholder.com/400x600?text=No+Image'
      
      return (
      <Card
        sx={{
          height: '100%', // 👈 full height in grid cell
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // 👈 keeps buttons at bottom
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 345,
        }}
      >
          <CardMedia
          component={'img'}
          height="220"
             sx={{ objectFit: 'contain' }}
          image={poster}
          alt={movie.title}
          />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>{movie.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="caption" sx={{ background:'#eef', px:1, borderRadius:1 }}>{movie.genre}</Typography>
          <Typography variant="caption" sx={{ background:'#f3f3f3', px:1, borderRadius:1 }}>{movie.duration} mins</Typography>
          <Typography variant="caption" sx={{ background:'#fff7e6', px:1, borderRadius:1 }}>{movie.rating} ⭐</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {movie.description}
        </Typography>
      </CardContent>
          <CardActions>
            <Button size='small' onClick={onView}>View</Button>
            <Button size='small' onClick={onShowtimes}>Showtimes</Button>
          </CardActions>
        </Card>
      )
}