import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { Container } from '@mui/material';

function App() {
  return (
    <Container maxWidth="lg" className="min-h-screen bg-gray-100">
 Bolton, Greater Manchester, United Kingdom
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        <Route path="/" element={<h1>Welcome to Movie Ticket Booking App</h1>} />
      </Routes>
    </Container>
  );
}

export default App;
