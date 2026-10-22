import express from 'express'
import {
  searchRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from '../controllers/route.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/search', searchRoutes)
router.get('/:id', getRouteById)

router.post('/', protect, adminOnly, createRoute)
router.put('/:id', protect, adminOnly, updateRoute)
router.delete('/:id', protect, adminOnly, deleteRoute)

export default router
