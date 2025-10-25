// import React, { useEffect, useState } from 'react';
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Typography,
//   Stack,
//   CircularProgress,
// } from '@mui/material';
// import axios from 'axios';

// export default function BookingDashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch bookings summary
//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('accessToken'); // admin token
//       const res = await axios.get('http://localhost:8003/api/admin/bookings-summary/', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setBookings(res.data);
//     } catch (error) {
//       console.error('Error fetching bookings summary:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   if (loading)
//     return (
//       <Stack alignItems="center" mt={6}>
//         <CircularProgress />
//         <Typography variant="body1" mt={2}>
//           Loading booking summary...
//         </Typography>
//       </Stack>
//     );

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden', mt: 6, p: 2 }}>
//       <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
//         🎫 Booking Summary
//       </Typography>

//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>User Name</TableCell>
//               <TableCell>User Email</TableCell>
//               <TableCell align="center">Total Seats Booked</TableCell>
//               <TableCell align="center">Total Revenue (₹)</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {bookings
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((b, index) => (
//                 <TableRow hover key={index}>
//                   <TableCell>{b.user_name}</TableCell>
//                   <TableCell>{b.user_email}</TableCell>
//                   <TableCell align="center">{b.total_bookings}</TableCell>
//                   <TableCell align="center">{b.total_revenue.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={bookings.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import axios from "axios";

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch booking summary
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Make sure admin token is set
      const response = await axios.get(
        "http://localhost:8000/api/admin/bookings-summary/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading)
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading booking summary...
        </Typography>
      </Stack>
    );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        🎟️ Booking Summary (User-wise)
      </Typography>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell align="right">Total Bookings</TableCell>
              <TableCell align="right">Total Seats</TableCell>
              <TableCell align="right">Total Revenue (₹)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={index} hover>
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell>{user.user_email}</TableCell>
                  <TableCell align="right">{user.total_bookings}</TableCell>
                  <TableCell align="right">{user.total_seats}</TableCell>
                  <TableCell align="right">
                    ₹{user.total_revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={bookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
