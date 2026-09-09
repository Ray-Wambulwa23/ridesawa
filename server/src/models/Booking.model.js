import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    seats: [
      {
        seatNumber: { type: Number, required: true },
        passengerName: { type: String, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    bookingReference: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'RW-' + Date.now().toString(36).toUpperCase()
  }
  next()
})

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
