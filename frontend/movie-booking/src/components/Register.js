// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, Typography, Box, Paper } from '@mui/material';
// import { toast } from 'react-toastify';
// import api from '../utils/api';

// function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     phone_number: '',
//     password: '',
//     password2: '',
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/register/', formData);
//       toast.success('Registration successful! Please log in.');
//       navigate('/login');
//     } catch (error) {
//       toast.error(error.response?.data?.error || 'Registration failed.');
//     }
//   };

//   return (
//     <Box className="flex justify-center items-center min-h-screen">
//       <Paper elevation={3} className="p-6 w-full max-w-md">
//         <Typography variant="h5" className="mb-4 text-center">
//           Register
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Phone Number"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Confirm Password"
//             name="password2"
//             type="password"
//             value={formData.password2}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             className="mt-4"
//           >
//             Register
//           </Button>
//         </form>
//         <Typography className="mt-4 text-center">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-500">
//             Log in
//           </a>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }

// export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, FormControlLabel, Switch } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
  });
  const [isAdmin, setIsAdmin] = useState(false); // new state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePasswordStrength = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character regex
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!validatePasswordStrength(formData.password)) {
      toast.error(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    // try {
    //   const payload = { ...formData, is_admin: isAdmin };
    //   const response = await api.post('/register/', payload);
    //   toast.success('Registration successful! Please log in.');
    //   navigate('/login');
    // } catch (error) {
    //   toast.error(error.response?.data?.error || 'Registration failed.');
    // }
    try {
      const payload = { ...formData, is_admin: isAdmin };
      const response = await api.post('/register/', payload);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const backendError = error.response?.data;
      if (typeof backendError === 'object') {
        // Show combined field errors if multiple
        const msg = Object.values(backendError).flat().join(' ');
        toast.error(msg || 'Registration failed.');
      } else {
        toast.error('Registration failed.');
      }
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen">
      <Paper elevation={3} className="p-6 w-full max-w-md">
        <Typography variant="h5" className="mb-4 text-center">
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
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
            name="password2"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} color="primary" />
            }
            label="Register as Admin"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Register
          </Button>
        </form>
        <Typography className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
