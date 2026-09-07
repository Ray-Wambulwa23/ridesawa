import express from 'express'
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/booking.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect) // All booking routes require authentication

router.post('/', createBooking)
router.get('/my', getUserBookings)
router.get('/:id', getBookingById)
router.patch('/:id/cancel', cancelBooking)

export default router
