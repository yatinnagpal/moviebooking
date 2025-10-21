import React from 'react'
import {Card, CardMedia, CardContent, Typography, CardActions, Button, Box} from '@mui/material'

export default function MovieCard({movie}){
      const poster = movie.poster_url || 'https://via.placeholder.com/400x600?text=No+Image'
      
      return (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
          <CardMedia
          component={'img'}
          height="220"
          sx={{ objectFit: 'cover' }}
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
            <Button size='small'>View</Button>
            <Button size='small'>Showtimes</Button>
          </CardActions>
        </Card>
      )
}