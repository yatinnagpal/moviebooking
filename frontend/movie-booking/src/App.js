
import './App.css';
import Movies from './pages/movies';
import MovieDetail from './pages/MovieDetail'
import Showtimes from './pages/Showtimes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:id/showtimes" element={<Showtimes />} />
      </Routes>
    </Router>
  );
}

export default App;
