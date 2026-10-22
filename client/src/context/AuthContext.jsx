import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if a token exists in localStorage
  // If it does, fetch the user profile so they stay logged in on refresh
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getProfile()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token')) // token expired or invalid
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (formData) => {
    const res = await authService.register(formData)
    // Save the token to localStorage so it persists on page refresh
    localStorage.setItem('token', res.data.data.token)
    setUser(res.data.data)
  }

  const login = async (formData) => {
    const res = await authService.login(formData)
    localStorage.setItem('token', res.data.data.token)
    setUser(res.data.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
