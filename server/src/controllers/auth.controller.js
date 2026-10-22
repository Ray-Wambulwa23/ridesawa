import User from '../models/User.model.js'
import generateToken from '../utils/generateToken.js'

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' })
    }

    // Create the new user — password gets hashed automatically by the model's pre('save') hook
    const user = await User.create({ name, email, password, phone })

    // Respond with the user info and a token
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare the entered password with the hashed one in the database
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Respond with user info and a fresh token
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware after verifying the token
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
