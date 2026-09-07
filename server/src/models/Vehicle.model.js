import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['bus', 'cab'],
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    amenities: [String], // e.g. ['wifi', 'ac', 'usb-charging']
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Vehicle = mongoose.model('Vehicle', vehicleSchema)
export default Vehicle
