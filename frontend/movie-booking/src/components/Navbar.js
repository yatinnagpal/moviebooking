import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');

    try {
      if (refresh) {
        await axios.post('http://localhost:8000/api/logout/', { refresh }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    } finally {
      // Clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <h2>Movie Booking</h2>
      <div className="nav-links">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
