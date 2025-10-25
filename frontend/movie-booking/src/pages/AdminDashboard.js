import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieDashboard from './MovieDashboard';
import BookingDashboard from './BookingDashboard';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <Typography variant="h4" gutterBottom>
        Welcome, Admin!
      </Typography>
      <Typography variant="body1" gutterBottom>
        You have full access to the admin panel.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to User Homepage
      </Button>
      <MovieDashboard />
      <BookingDashboard />
    </Box>
  );
}

export default AdminDashboard;
