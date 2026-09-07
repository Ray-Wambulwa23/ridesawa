// Basic form validators

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isValidPhone = (phone) => {
  return /^\+?[\d\s\-]{9,15}$/.test(phone)
}

export const isStrongPassword = (password) => {
  return password.length >= 8
}
