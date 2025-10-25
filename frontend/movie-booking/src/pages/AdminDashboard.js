// import React, { useEffect, useState } from 'react';
// import { Typography, Box, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MovieDashboard from './MovieDashboard';
// import { BarChart } from '@mui/icons-material';
// import BookingDashboard from './BookingDashboard';

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     availableHalls: 0,
//     totalMovies: 0,
//     revenue: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   // Fetch admin statistics
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         const response = await axios.get('http://localhost:8000/api/admin/stats/', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setStats(response.data);
//       } catch (error) {
//         console.error('Error fetching admin stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (loading) {
//     return (
//       <Box className="flex justify-center items-center min-h-screen">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box className="min-h-screen bg-gray-100 py-10">
//       {/* Header Section */}
//       <Box className="flex flex-col justify-center items-center mb-8">
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Welcome, Admin!
//         </Typography>
//         <Typography variant="body1" gutterBottom>
//           You have full access to the admin panel.
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate('/')}
//           sx={{ mt: 2 }}
//         >
//           Go to User Homepage
//         </Button>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={3} justifyContent="center" sx={{ px: 4 }}>
//         {[
//             {
//             title: '🎟️ Total Bookings',
//             value: stats.totalBookings,
//             subtitle: 'Across all users',
//             },
//             {
//             title: '🏛️ Available Halls',
//             value: stats.availableHalls,
//             subtitle: 'Ready for new shows',
//             },
//             {
//             title: '🎬 Movies Running',
//             value: stats.totalMovies,
//             subtitle: 'Currently on screen',
//             },
//             {
//             title: '💰 Total Revenue',
//             value: `₹${stats.revenue.toLocaleString()}`,
//             subtitle: 'Till date',
//             },
//         ].map((item, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card className="shadow-lg hover:shadow-xl transition">
//                 <CardContent
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     textAlign: 'center',
//                     minHeight: 150,
//                 }}
//                 >
//                 <Typography variant="h6" color="textSecondary" gutterBottom>
//                     {item.title}
//                 </Typography>
//                 <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
//                     {item.value}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                     {item.subtitle}
//                 </Typography>
//                 </CardContent>
//             </Card>
//             </Grid>
//         ))}
//     </Grid>


//       {/* Movie List Section */}
//       <Box className="mt-10">
//         <Typography variant="h5" textAlign="center" gutterBottom>
//           🎞️ Manage Movies
//         </Typography>
//         <MovieDashboard />
//       </Box>
//     </Box>
//   );
// }

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieDashboard from './MovieDashboard';
import BookingDashboard from './BookingDashboard';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    availableHalls: 0,
    totalMovies: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/admin/stats/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100 py-10">
      {/* Header Section */}
      <Box className="flex flex-col justify-center items-center mb-8">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, Admin!
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have full access to the admin panel.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go to User Homepage
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} justifyContent="center" sx={{ px: 4 }}>
        {[
          {
            title: '🎟️ Total Bookings',
            value: stats.totalBookings,
            subtitle: 'Across all users',
          },
          {
            title: '🏛️ Available Halls',
            value: stats.availableHalls,
            subtitle: 'Ready for new shows',
          },
          {
            title: '🎬 Movies Running',
            value: stats.totalMovies,
            subtitle: 'Currently on screen',
          },
          {
            title: '💰 Total Revenue',
            value: `₹${stats.revenue.toLocaleString()}`,
            subtitle: 'Till date',
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="shadow-lg hover:shadow-xl transition">
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 150,
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Movie List Section */}
      <Box className="mt-10">
        <Typography variant="h5" textAlign="center" gutterBottom>
          🎞️ Manage Movies
        </Typography>
        <MovieDashboard />
      </Box>

      {/* Booking Summary Section */}
      <Box className="mt-10">
        <Typography variant="h5" textAlign="center" gutterBottom>
          📋 Booking Summary
        </Typography>
        <BookingDashboard />
      </Box>
    </Box>
  );
}

export default AdminDashboard;
