import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../utils/api';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });

  // ✅ Capture both uidb64 and token from URL
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      // ✅ Include both uidb64 and token in API endpoint
      const response = await api.post(`/reset-password/${uidb64}/${token}/`, formData);

      toast.success(response.data.message || 'Password reset successfully.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password.');
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen">
      <Paper elevation={3} className="p-6 w-full max-w-md">
        <Typography variant="h5" className="mb-4 text-center">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Reset Password
          </Button>
        </form>
        <Typography className="mt-4 text-center">
          Return to{' '}
          <a href="/login" className="text-blue-500">
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
