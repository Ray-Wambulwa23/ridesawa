import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SearchResults from './pages/SearchResults'
import BookingDetails from './pages/BookingDetails'
import BookingConfirmation from './pages/BookingConfirmation'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App
