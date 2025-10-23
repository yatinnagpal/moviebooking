
import './App.css';
import Movies from './pages/movies';
import MovieDetail from './pages/MovieDetail'
import Showtimes from './pages/Showtimes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:id/showtimes" element={<Showtimes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        {/* <Route path="/" element={<h1>Welcome to Movie Ticket Booking App</h1>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
