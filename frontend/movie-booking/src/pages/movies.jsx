import React, {useState, useEffect} from 'react'
import { Box, Grid, TextField, IconButton, InputAdornment, Typography, CircularProgress, Button, Card, CardContent, CardMedia } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import API from '../api'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom';


function Movies() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true
    async function loadMovies(){
        try {
          const res = await API.get('/movies/')
          if(mounted){
            console.log('movies', res.data);
            setMovies(res.data)
            setLoading(false)
          }
        } catch (error) {
          console.log('failed to load movies', error)
        }
        finally{
          if(mounted){
          setLoading(false)
          }
        }
    }
    loadMovies()
    return () => mounted = false
    }, [])

const filtered = movies.filter(m => 
 (m.title || '').toLowerCase().includes(search.toLowerCase())
)

const handleView = (movie) => setSelectedMovie(movie);
const handleShowtimes = (movie) => navigate(`/movies/${movie.id}/showtimes`);
const handleCloseModal = () => setSelectedMovie(null);


  return (
    <Box>
    <Box sx={{
      display: 'flex',
      gap:2, mb:3, alignItems: 'center', flexWrap: 'wrap'}}>
        <Typography variant='h5' sx={{minWidth:200}}>VookMyShow</Typography>
        <TextField
            value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search movies by title...'
          size='small'
          variant='outlined'
          sx={{flex:1, minWidth:200}}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {search ? 
                <IconButton size='small' onClick={() => setSearch('')}>
                  <ClearIcon />
                </IconButton>
                : <SearchIcon />}
              </InputAdornment>
            )
          }}
        />
        <Button variant='contained' onClick={() => setSearch('')}>Clear</Button>
    </Box>
    {loading ? (
        <Box sx={{display:'flex', justifyContent:'center', mt:6}}>
          <CircularProgress />
        </Box>
    ) : 
     filtered.length === 0 ? (
      <Typography>No movies found</Typography>
     ) : (
        <Grid container spacing={2}>
          {filtered.map(movie => (
            <Grid item xs={12} ml={4} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard 
                movie={movie} 
                onView={() => handleView(movie)} 
                onShowtimes={() => handleShowtimes(movie)} 
              />
            </Grid>
            ))}
        </Grid>
     )
    }
{selectedMovie && (
  <Box
    onClick={handleCloseModal}
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <Card
      onClick={(e) => e.stopPropagation()}
      sx={{
        width: { xs: '90%', sm: 480 },
        maxHeight: '85vh', // 👈 modal won’t exceed viewport height
        overflowY: 'auto',
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ✅ FIX: controlled image height */}
      <CardMedia
        component="img"
        image={selectedMovie.poster_url}
        alt={selectedMovie.title}
        sx={{
          height: 300, // 👈 fixed image height (responsive enough)
          objectFit: 'contain', // 👈 cropped nicely
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          {selectedMovie.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {selectedMovie.description}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Genre: {selectedMovie.genre}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Duration: {selectedMovie.duration} mins
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Rating: {selectedMovie.rating} ⭐
        </Typography>
      </CardContent>

      {/* ✅ Button stays visible */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={() => handleShowtimes(selectedMovie)}
        >
          View Showtimes
        </Button>
      </Box>

      {/* ✅ Close button fixed */}
      <Button
        onClick={handleCloseModal}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          minWidth: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#eee',
          '&:hover': { backgroundColor: '#ddd' },
        }}
      >
        ✕
      </Button>
    </Card>
  </Box>
)}

    </Box>
  )
}

export default Movies