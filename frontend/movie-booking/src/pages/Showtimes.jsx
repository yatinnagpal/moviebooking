import React,{useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Box, Grid, Card, CardContent, Typography, CircularProgress, Button, CardActions, TextField} from '@mui/material'
import API from '../api';

export default function Showtimes() {

  const {id} = useParams();
  const navigate = useNavigate()
  const [showtimes, setShowtimes] = useState()
  const [loading, setLoading] = useState(true)
  const [movieTitle, setMovieTitle] = useState()
  const [bookingForm, setBookingForm] = useState({}); // track which showtime's form is open
  const [formData, setFormData] = useState({});

  useEffect(()=>{
    let mounted=true;
    async function fetchShowtimes(){
      try{
      const res = await API.get(`/showtimes/?movie_id=${id}`)
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

  const handleFormToggle = (showtimeId) => {
    setBookingForm(prev => ({ ...prev, [showtimeId]: !prev[showtimeId] }));
    setFormData({ name: '', email: '' }); // reset form on toggle
  };


  const handleInputChange = (showtimeId, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [showtimeId]: { 
        ...prev[showtimeId], 
        [name]: value 
      }
    }));
  };

  const handleBook = async (st) => {
  const data = formData[st.id];
  if (!data?.name || !data?.email) {
    alert("Please enter name and email");
    return;
  }
  const seatsToBook = Number(data.seats);
  if (seatsToBook <= 0 || seatsToBook > st.seats_available) {
    alert("Invalid number of seats");
    return;
  }

  try {
    await API.post('/bookings/', {
      showtime: st.id,
      seats_booked: seatsToBook,
      user_name: data.name,
      user_email: data.email
    });
    alert("Booking confirmed!");
    // Update showtime seats locally
    setShowtimes(prev => prev.map(s => s.id === st.id ? {...s, seats_available: s.seats_available - seatsToBook } : s));
    // Reset this form
    setBookingForm(prev => ({ ...prev, [st.id]: false }));
    setFormData(prev => ({ ...prev, [st.id]: { name:'', email:'', seats:1 } }));
  } catch(err) {
    alert(err.response?.data?.error || "Booking failed!");
  }
};


  if (loading) return <CircularProgress />;


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
                  {bookingForm[st.id] ? (
  <Box sx={{ mt: 1, display:'flex', flexDirection:'column', gap:1 }}>
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
      inputProps={{ min:1, max:st.seats_available }}
      value={formData[st.id]?.seats || 1}
      onChange={(e) => handleInputChange(st.id, e)}
    />
    <Button variant="contained" onClick={() => handleBook(st)}>Confirm Booking</Button>
    <Button variant="text" onClick={() => handleFormToggle(st.id)}>Cancel</Button>
  </Box>
) : (
  <Button
    variant="contained"
    sx={{ mt:1 }}
    onClick={() => handleFormToggle(st.id)}
    disabled={st.seats_available <= 0}
  >
    {st.seats_available <= 0 ? "Sold Out" : "Book Now"}
  </Button>
)}

              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
