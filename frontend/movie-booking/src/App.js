import './App.css';
import Movies from './pages/movies';
import MovieDetail from './pages/MovieDetail';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ShowtimeDashboard from './pages/ShowtimeDashboard';
import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import BookingDashboard from './pages/BookingDashboard';

// App is mounted by `index.js`. Keep App a pure component that returns routes.

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <Router>
      <MainContent />
    </Router>
  );
}

// 👇 create a separate component that uses useLocation safely
function MainContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path="/showtimes/:movieId" element={<ShowtimeDashboard />} />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdminRoute>
              <BookingDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
