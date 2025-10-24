// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, Typography, Box, Paper } from '@mui/material';
// import { toast } from 'react-toastify';
// import api from '../utils/api';
// import { AuthContext } from '../context/AuthContext';

// function Login() {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/login/', formData);
//       login(response.data.access, response.data.refresh, response.data.user);
//       toast.success('Login successful!');
//       navigate('/');
//     } catch (error) {
//       toast.error(error.response?.data?.error || 'Login failed.');
//     }
//   };

//   return (
//     <Box className="flex justify-center items-center min-h-screen">
//       <Paper elevation={3} className="p-6 w-full max-w-md">
//         <Typography variant="h5" className="mb-4 text-center">
//           Login
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
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
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
//             Login
//           </Button>
//         </form>
//         <Typography className="mt-4 text-center">
//           Don't have an account?{' '}
//           <a href="/register" className="text-blue-500">
//             Register
//           </a>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }

// export default Login;
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, FormControlLabel, Switch } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAdmin, setIsAdmin] = useState(false); // toggle state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please enter both username and password.');
      return;
    }
    
    try {
      const payload = { ...formData, is_admin: isAdmin };
      const response = await api.post('/login/', payload);

      login(response.data.access, response.data.refresh, response.data.user);
      toast.success('Login successful!');

      // Conditional navigation based on admin/user
      if (response.data.user.is_admin) navigate('/admin');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen">
      <Paper elevation={3} className="p-6 w-full max-w-md">
        <Typography variant="h5" className="mb-4 text-center">
          Login
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControlLabel
            control={<Switch checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} color="primary" />}
            label="Login as Admin"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Login
          </Button>
        </form>
        <Typography className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;