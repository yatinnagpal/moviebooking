import React,{useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Box, Grid, Card, CardContent, Typography, CircularProgress, Button, CardActions} from '@mui/material'
import API from '../api';

export default function Showtimes() {

  const {id} = useParams();
  const navigate = useNavigate()
  const [showtimes, setShowtimes] = useState()
  const [loading, setLoading] = useState(true)
  const [movieTitle, setMovieTitle] = useState()

  useEffect(()=>{
    let mounted=true;
    async function fetchShowtimes(){
      try{
      const res = await API.get(`/showtimes/?movie=${id}`)
      if (mounted) setShowtimes(res.data);
      const movieRes = await API.get(`/movies/${id}`)
      if (mounted) setMovieTitle(movieRes.data.title);
      }
      catch(error){
        console.log('Failed to load showtimes', error)
      }
      finally{
        if (mounted) setLoading(false);
      }
    }
    fetchShowtimes();
    return () => mounted=false;
  },[id])

  const handleBook = (showtimeId) => {
    console.log('Book showtime', showtimeId)
  }

  return (
    <Box sx= {{p:2}}>
      <Button variant='outlined' sx={{mb:2}} onClick={()=> navigate(-1)}>Back</Button>
      <Typography variant='h5' sx={{mb:3}}>{movieTitle}</Typography>

      {loading ? (
        <Box sx={{display:'flex', justifyContent:'center', mt:6}}>
        <CircularProgress/>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {showtimes.map(st => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={st.id}>
              <Card sx={{p:1, display:'flex', flexDirection:'column', justifyContent: 'space-between', height:'100%'}}>
                <CardContent>
                  <Typography variant='subtitle1' gutterBottom>{st.hall_name}</Typography>
                  <Typography variant='body2' sx={{mb:1}}>
                    {new Date(st.start_time).toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short'})}
                  </Typography>
                  <Typography variant='body2'>Seats Available: {st.seats_available}/{st.seats_total}</Typography>
                  <Typography variant="body2">Price: Rs{st.price_per_ticket}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" fullWidth getClick={()=> handleBook(st.id)}>Book Now</Button>
                  </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
