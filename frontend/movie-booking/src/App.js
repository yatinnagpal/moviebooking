import './App.css';
import Movies from './pages/movies';
import MovieDetail from './pages/MovieDetail';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ShowtimeDashboard from './pages/ShowtimeDashboard';
import { AuthProvider } from './context/AuthContext'; // adjust path
import ReactDOM from 'react-dom/client';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

function App() {
  const isAuthPage =
    window.location.pathname === '/login' || window.location.pathname === '/register';
  return (
    <Router>
      {!isAuthPage && <Navbar />} {/* Hide navbar on login/register pages */}
      <Routes>
        <Route path="/" element={<Movies />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* Protect the admin dashboard route */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              {' '}
              <AdminDashboard />{' '}
            </ProtectedAdminRoute>
          }
        />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path="/showtimes/:movieId" element={<ShowtimeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
