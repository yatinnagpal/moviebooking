// import React, { useEffect, useState } from "react";
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   CircularProgress,
//   Typography,
//   Stack,
// } from "@mui/material";
// import axios from "axios";

// export default function BookingDashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch booking summary
//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem("accessToken"); // Make sure admin token is set
//       const response = await axios.get(
//         "http://localhost:8000/api/admin/bookings-summary/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setBookings(response.data);
//     } catch (error) {
//       console.error("Error fetching booking summary:", error);
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
//     <Paper sx={{ width: "100%", overflow: "hidden", mt: 4, p: 2 }}>
//       <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
//         🎟️ Booking Summary (User-wise)
//       </Typography>

//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>User Name</TableCell>
//               <TableCell>User Email</TableCell>
//               <TableCell align="right">Total Bookings</TableCell>
//               <TableCell align="right">Total Seats</TableCell>
//               <TableCell align="right">Total Revenue (₹)</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {bookings
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((user, index) => (
//                 <TableRow key={index} hover>
//                   <TableCell>{user.user_name}</TableCell>
//                   <TableCell>{user.user_email}</TableCell>
//                   <TableCell align="right">{user.total_bookings}</TableCell>
//                   <TableCell align="right">{user.total_seats}</TableCell>
//                   <TableCell align="right">
//                     ₹{user.total_revenue.toLocaleString()}
//                   </TableCell>
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
  TextField,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "user_name", direction: "asc" });

  // Fetch booking summary
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:8000/api/admin/bookings-summary/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = bookings.filter(
      (b) =>
        b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
    setPage(0);
  }, [searchQuery, bookings]);

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

    setSortConfig({ key, direction });

    const sorted = [...filteredBookings].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBookings(sorted);
  };

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
        🎫 User-wise Booking Summary
      </Typography>

      {/* Search */}
      <TextField
        label="Search by User Name or Email"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "user_name"}
                  direction={sortConfig.key === "user_name" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("user_name")}
                >
                  User Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "user_email"}
                  direction={sortConfig.key === "user_email" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("user_email")}
                >
                  User Email
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "total_bookings"}
                  direction={sortConfig.key === "total_bookings" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("total_bookings")}
                >
                  Total Bookings
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "total_seats"}
                  direction={sortConfig.key === "total_seats" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("total_seats")}
                >
                  Total Seats
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "total_revenue"}
                  direction={sortConfig.key === "total_revenue" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("total_revenue")}
                >
                  Total Revenue (₹)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBookings
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
        count={filteredBookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
