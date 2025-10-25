import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 👈 adjust the path
import { Clapperboard } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // 👈 get auth state here

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Clapperboard className="w-7 h-7 text-yellow-300" />
          <h2 className="text-2xl font-semibold tracking-wide hover:text-yellow-300 transition">
            Movie<span className="text-yellow-300">Booking</span>
          </h2>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="hover:text-yellow-300 transition">
            Home
          </button>

          {user && (
            <button
              onClick={() => navigate('/bookings')}
              className="hover:text-yellow-300 transition"
            >
              My Bookings
            </button>
          )}

          {user ? (
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
