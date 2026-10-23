import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-white text-[#061B62] px-3 py-1 rounded-lg font-extrabold text-lg">
          R
        </div>
        <span className="text-white font-bold text-xl tracking-wide">Ridesawa</span>
      </Link>

      {/* Nav links - center */}
      <div className="hidden md:flex items-center gap-8 text-sm text-white font-medium">
        <Link to="/" className="hover:text-blue-300 transition">Home</Link>
        <Link to="/search" className="hover:text-blue-300 transition">Search</Link>
        <Link to="/about" className="hover:text-blue-300 transition">About</Link>
        <Link to="/contact" className="hover:text-blue-300 transition">Contact</Link>
      </div>

      {/* Auth buttons - right */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-white text-sm hidden md:block">
              Hello, {user.name}
            </span>
            <Link
              to="/dashboard"
              className="text-white text-sm border border-white/40 px-4 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-[#061B62] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white text-sm border border-white/40 px-4 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-[#061B62] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar
