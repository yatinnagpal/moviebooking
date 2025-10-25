import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Stack,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api";

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showSnackbar("Failed to fetch bookings!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Delete booking
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await API.delete(`/bookings/${id}/`);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showSnackbar("Booking cancelled successfully!", "success");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        showSnackbar("Failed to cancel booking!", "error");
      }
    }
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
          Loading bookings...
        </Typography>
      </Stack>
    );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        🧾 Booking Dashboard
      </Typography>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Movie</TableCell>
              <TableCell>Hall</TableCell>
              <TableCell>Showtime</TableCell>
              <TableCell>Seats Booked</TableCell>
              <TableCell>Total Price (₹)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No bookings available.
                </TableCell>
              </TableRow>
            ) : (
              bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{b.user_name || b.user_email}</TableCell>
<TableCell>{b.showtime_info.movie_title}</TableCell>
<TableCell>{b.showtime_info.hall_name}</TableCell>
<TableCell>
  {new Date(b.showtime_info.start_time).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })}
</TableCell>
<TableCell>{b.seats_booked}</TableCell>
<TableCell>{b.seats_booked * b.showtime_info.price_per_ticket}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(b.id)}
                        >
                          Cancel Booking
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
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

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
