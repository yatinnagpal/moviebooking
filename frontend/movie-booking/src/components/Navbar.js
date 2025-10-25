// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     const refresh = localStorage.getItem('refresh_token');

//     try {
//       if (refresh) {
//         await axios.post('http://localhost:8000/api/logout/', { refresh }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Logout error:', error.response?.data || error.message);
//     } finally {
//       // Clear tokens and redirect to login
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       navigate('/login');
//     }
//   };

//   return (
//     <nav className="navbar">
//       <h2>Movie Booking</h2>
//       <div className="nav-links">
//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clapperboard } from 'lucide-react';


const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');

    try {
      if (refresh) {
        await axios.post(
          'http://localhost:8000/api/logout/',
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Clapperboard className="w-7 h-7 text-yellow-300" />
          <h2 className="text-2xl font-semibold tracking-wide hover:text-yellow-300 transition">
            Movie<span className="text-yellow-300">Booking</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="hover:text-yellow-300 transition"
          >
            Home
          </button>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/bookings')}
              className="hover:text-yellow-300 transition"
            >
              My Bookings
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-400 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
