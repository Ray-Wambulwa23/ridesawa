import express from 'express'
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getVehicles)
router.get('/:id', getVehicleById)

// Admin only
router.post('/', protect, adminOnly, createVehicle)
router.put('/:id', protect, adminOnly, updateVehicle)
router.delete('/:id', protect, adminOnly, deleteVehicle)

export default router
