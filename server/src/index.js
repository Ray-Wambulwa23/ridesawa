import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

// Route imports (will be added as we build each feature)
import authRoutes from './routes/auth.routes.js'
import routeRoutes from './routes/route.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import vehicleRoutes from './routes/vehicle.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/vehicles', vehicleRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ridesawa API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
