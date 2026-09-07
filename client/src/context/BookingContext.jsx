import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(null)

  // Booking state management will go here

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
