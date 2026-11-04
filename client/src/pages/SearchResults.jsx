import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchRoutes } from '../services/bookingService'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Read values from the URL query string
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')
  const passengers = searchParams.get('passengers')
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('departureTime')

  // Fetch routes when the page loads
  useEffect(() => {                                                                                                                                                 
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        const res = await searchRoutes({ from, to, date, passengers })
        setRoutes(res.data.data)
      } catch (err) {
        setError('Failed to load routes. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [from, to, date, passengers])

  // Sort routes based on selected option
  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    return new Date(a.departureTime) - new Date(b.departureTime)
  })

  // Format time from a date string e.g. "07:00 AM"
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate duration between departure and arrival
  const getDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Search Summary Bar ── */}
      <div
        className="py-6 px-6"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(6,27,98,0.95) 30%, rgba(22,139,255,0.4) 100%)',
          backgroundColor: '#061B62',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <span className="font-bold text-lg">{from}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-bold text-lg">{to}</span>
            <span className="text-blue-200 text-sm ml-2">{date}</span>
            <span className="text-blue-200 text-sm">· {passengers} Passenger{passengers > 1 ? 's' : ''}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-sm border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Edit Search
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Sort Bar ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {loading ? 'Searching...' : `${sortedRoutes.length} result${sortedRoutes.length !== 1 ? 's' : ''} found`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="departureTime">Departure Time</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Searching for available buses...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && sortedRoutes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🚌</span>
            <h3 className="text-gray-700 font-semibold text-lg">No buses found</h3>
            <p className="text-gray-500 text-sm">Try a different date or route</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white text-sm px-6 py-2.5 rounded-lg hover:brightness-110 transition"
            >
              Search Again
            </button>
          </div>
        )}

        {/* ── Results List ── */}
        {!loading && !error && sortedRoutes.length > 0 && (
          <div className="flex flex-col gap-4">
            {sortedRoutes.map((route) => (
              <div
                key={route._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition"
              >
                {/* Left — Company & Times */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      {route.vehicle?.type?.toUpperCase() || 'BUS'}
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {route.vehicle?.name || 'Standard Coach'}
                    </span>
                  </div>

                  {/* Times */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">{formatTime(route.departureTime)}</p>
                      <p className="text-xs text-gray-500">{from}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs text-gray-400">{getDuration(route.departureTime, route.arrivalTime)}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <div className="w-16 h-px bg-gray-300" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="w-16 h-px bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">{formatTime(route.arrivalTime)}</p>
                      <p className="text-xs text-gray-500">{to}</p>
                    </div>
                  </div>

                  {/* Seats left */}
                  <p className="text-xs text-gray-500">
                    <span className={`font-semibold ${route.availableSeats < 5 ? 'text-red-500' : 'text-green-600'}`}>
                      {route.availableSeats} seats
                    </span>{' '}
                    available
                  </p>
                </div>

                {/* Right — Price & Book */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-gray-900">
                      KSh {route.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>

                  <button
                    onClick={() => navigate(`/booking/${route._id}?passengers=${passengers}`)}
                    className="bg-gradient-to-r from-[#061B62] via-[#1248C8] to-[#168BFF]
                               text-white text-sm font-semibold px-6 py-2.5 rounded-xl
                               hover:brightness-110 hover:-translate-y-0.5
                               transition-all duration-300 shadow-md shadow-blue-900/20"
                  >
                    Book Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default SearchResults
