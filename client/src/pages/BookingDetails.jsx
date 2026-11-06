import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { getRouteById, createBooking } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { formatTime } from '../utils/formatDate'
import SeatSelector from '../components/booking/SeatSelector'

// Calculate duration between two date strings
const getDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

const BookingDetails = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const passengers = Number(searchParams.get('passengers')) || 1

  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerNames, setPassengerNames] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true)
        const res = await getRouteById(id)
        setRoute(res.data.data)
      } catch (err) {
        setError('Failed to load route details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchRoute()
  }, [id])

  const handleSelectSeat = (seat) => {
    setSelectedSeats((prev) => {
      // Deselecting an already-selected seat drops its passenger name too
      if (prev.includes(seat)) {
        const names = { ...passengerNames }
        delete names[seat]
        setPassengerNames(names)
        return prev.filter((s) => s !== seat)
      }
      // Don't allow more seats than the number of passengers
      if (prev.length >= passengers) return prev
      return [...prev, seat]
    })
  }

  const handleNameChange = (seat, value) => {
    setPassengerNames((prev) => ({ ...prev, [seat]: value }))
  }

  const totalPrice = route ? route.price * passengers : 0
  const allNamesFilled =
    selectedSeats.length === passengers &&
    selectedSeats.every((s) => passengerNames[s]?.trim())

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (!user || !allNamesFilled) return
    setBookingError('')
    setSubmitting(true)
    try {
      const seats = [...selectedSeats]
        .sort((a, b) => a - b)
        .map((seatNumber) => ({
          seatNumber,
          passengerName: passengerNames[seatNumber].trim(),
        }))
      const res = await createBooking({ route: id, seats, totalPrice })
      navigate('/booking-confirmation', {
        state: { booking: res.data?.data },
      })
    } catch (err) {
      setBookingError(
        err.response?.data?.message || 'Booking failed. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading route details...</p>
      </div>
    )
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-6">
        <span className="text-5xl">😕</span>
        <h3 className="text-gray-700 font-semibold text-lg">{error}</h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white text-sm px-6 py-2.5 rounded-lg hover:brightness-110 transition"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!route) return null

  const totalSeats = route.vehicle?.totalSeats || 40
  const seatsNeeded = passengers
  const remaining = seatsNeeded - selectedSeats.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Trip Summary Bar ── */}
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
            <span className="font-bold text-lg">{route.origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-bold text-lg">{route.destination}</span>
            <span className="text-blue-200 text-sm ml-2">
              {new Date(route.departureTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-blue-200 text-sm">
              · {passengers} Passenger{passengers > 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-sm border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Back to Results
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Seat Selection ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-gray-800 font-semibold">Select your seats</h2>
            <span
              className={`text-sm ${
                selectedSeats.length === seatsNeeded ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {selectedSeats.length}/{seatsNeeded} selected
            </span>
          </div>

          <SeatSelector
            totalSeats={totalSeats}
            selectedSeats={selectedSeats}
            maxSelectable={seatsNeeded}
            onSelect={handleSelectSeat}
          />

          {remaining > 0 && (
            <p className="text-center text-gray-400 text-xs mt-4">
              Please select {remaining} more seat{remaining > 1 ? 's' : ''}.
            </p>
          )}
        </div>

        {/* ── Summary + Passenger Details ── */}
        <div className="flex flex-col gap-4">
          {/* Trip Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {route.vehicle?.type?.toUpperCase() || 'BUS'}
              </div>
              <span className="text-gray-800 font-semibold text-sm">
                {route.vehicle?.name || 'Standard Coach'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatTime(route.departureTime)}</p>
                <p className="text-xs text-gray-500">{route.origin}</p>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs text-gray-400">{getDuration(route.departureTime, route.arrivalTime)}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <div className="flex-1 h-px bg-gray-300" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatTime(route.arrivalTime)}</p>
                <p className="text-xs text-gray-500">{route.destination}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500">Price per person</span>
              <span className="text-gray-800 font-semibold">KSh {route.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-800 font-semibold text-sm mb-4">Passenger details</h3>

            {selectedSeats.length === 0 ? (
              <p className="text-gray-400 text-sm">Select seats to enter passenger names.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...selectedSeats]
                  .sort((a, b) => a - b)
                  .map((seat) => (
                    <div key={seat} className="flex items-center gap-3">
                      <span className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {seat}
                      </span>
                      <input
                        type="text"
                        value={passengerNames[seat] || ''}
                        onChange={(e) => handleNameChange(seat, e.target.value)}
                        placeholder={`Passenger name (seat ${seat})`}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Total + Confirm */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-sm">
                Total ({passengers} × KSh {route.price.toLocaleString()})
              </span>
              <span className="text-2xl font-extrabold text-gray-900">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>

            {bookingError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mt-3 mb-1">
                {bookingError}
              </div>
            )}

            {user ? (
              <button
                onClick={handleConfirm}
                disabled={!allNamesFilled || submitting}
                className="w-full mt-3 bg-gradient-to-r from-[#061B62] via-[#1248C8] to-[#168BFF]
                           text-white text-sm font-semibold py-3 rounded-xl
                           hover:brightness-110 hover:-translate-y-0.5
                           transition-all duration-300 shadow-md shadow-blue-900/20
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            ) : (
              <div className="mt-3 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Please log in to complete your booking
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails
