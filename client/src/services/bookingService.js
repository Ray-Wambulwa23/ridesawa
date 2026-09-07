import api from './api'

export const searchRoutes = (params) => api.get('/routes/search', { params })
export const getRouteById = (id) => api.get(`/routes/${id}`)
export const createBooking = (data) => api.post('/bookings', data)
export const getUserBookings = () => api.get('/bookings/my')
export const getBookingById = (id) => api.get(`/bookings/${id}`)
