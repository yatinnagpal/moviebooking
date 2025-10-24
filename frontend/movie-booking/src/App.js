
import './App.css';
import Movies from './pages/movies';
import MovieDetail from './pages/MovieDetail'
import Showtimes from './pages/Showtimes'
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SeatSelection from './pages/SeatSelection';


function App() {
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
  return (
    <Router>
      {!isAuthPage && <Navbar />}  {/* Hide navbar on login/register pages */}
      <Routes>
        <Route path="/" element={<Movies />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* Protect the admin dashboard route */}
        <Route path="/admin" element={ <ProtectedAdminRoute> <AdminDashboard /> </ProtectedAdminRoute> } />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:id/showtimes" element={<Showtimes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        <Route path="/showtimes/:showtimeId/seats" element={<SeatSelection />} />
        {/* <Route path="/" element={<h1>Welcome to Movie Ticket Booking App</h1>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
