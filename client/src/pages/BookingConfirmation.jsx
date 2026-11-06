// Booking confirmation page - shows ticket/booking summary
import { useLocation, Link } from 'react-router-dom'

const BookingConfirmation = () => {
  const { state } = useLocation()
  const booking = state?.booking

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-6">Your ticket has been booked successfully.</p>

        {booking ? (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="text-gray-800 font-semibold">{booking.bookingReference || '—'}</span>
            </div>
            {booking.seats?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Seats</span>
                <span className="text-gray-800 font-semibold">
                  {booking.seats.map((s) => s.seatNumber).join(', ')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="text-gray-800 font-semibold">
                KSh {booking.totalPrice?.toLocaleString() || '—'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-6">Booking details unavailable.</p>
        )}

        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition"
          >
            View Bookings
          </Link>
          <Link
            to="/"
            className="border border-gray-200 text-gray-600 text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
