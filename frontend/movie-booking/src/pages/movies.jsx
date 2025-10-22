import React, {useState, useEffect} from 'react'
import  {Box, Grid, TextField, IconButton, InputAdornment, Typography, CircularProgress, Button} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import API from '../api'
import MovieCard from '../components/MovieCard'


function Movies() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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
                <MovieCard movie={movie} />
            </Grid>
            ))}
        </Grid>
     )
    }
    </Box>
  )
}

export default Movies