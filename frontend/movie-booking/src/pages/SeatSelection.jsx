import React, { useState, useEffect } from 'react';
import API from '../api';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeats() {
      try {
        const res = await API.get(`/seats/?showtime=${showtimeId}`);
        setSeats(res.data);
      } catch (error) {
        console.error('Failed to load seats', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSeats();
  }, [showtimeId]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const confirmBooking = async () => {
    const user_name = prompt("Enter your name:");
    const user_email = prompt("Enter your email:");

    try {
      await API.post('/bookings/', {
        showtime: showtimeId,
        seat_ids: selected,
        user_name,
        user_email
      });
      alert("Booking Confirmed!");
      navigate('/'); // redirect to home or bookings page
    } catch (error) {
      alert("Booking failed! Try again.");
      console.error(error);
    }
  };

  if (loading) return <CircularProgress />;
  console.log('seats', seats);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Select Your Seats</Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(10, 1fr)', 
        gap: 1, 
        mt: 2 
      }}>
        {seats.map(seat => (
          <Button
            key={seat.id}
            variant="contained"
            sx={{
              backgroundColor: seat.is_booked
                ? 'red'
                : selected.includes(seat.id)
                  ? 'green'
                  : 'grey',
            }}
            disabled={seat.is_booked}
            onClick={() => toggleSeat(seat.id)}
          >
            {seat.seat_number}
          </Button>
        ))}
      </Box>

      {selected.length > 0 && (
        <Button 
          onClick={confirmBooking} 
          variant="contained" 
          sx={{ mt: 3 }}
        >
          Confirm Booking ({selected.length} seats)
        </Button>
      )}
    </Box>
  );
}
