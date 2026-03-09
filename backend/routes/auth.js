const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { hashPassword, generate6DigitCode } = require('../utils/helpers')
const { users } = require('../utils/store')

// Register (creates user with 6-digit code and email verification token)
router.post('/register', (req, res) => {
  const { name, email, password, mobile } = req.body
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ error: 'name, email, password and mobile are required' })
  }
  const exists = users.find((u) => u.email === email)
  if (exists) return res.status(409).json({ error: 'Email already registered' })

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    mobile,
    userCode: generate6DigitCode(),
    emailVerified: false,
    verificationToken: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  users.push(user)

  // NOTE: In production send verification email containing the token.
  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    userCode: user.userCode,
    emailVerified: user.emailVerified,
    verificationToken: user.verificationToken,
  })
})

// Login (email + password)
router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const user = users.find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  if (user.passwordHash !== hashPassword(password)) return res.status(401).json({ error: 'Invalid credentials' })

  // Return minimal user info (token generation omitted)
  return res.json({ id: user.id, name: user.name, email: user.email, userCode: user.userCode, emailVerified: user.emailVerified })
})

// Logout
router.post('/logout', (req, res) => {
  // In a real app, you'd handle token invalidation here
  return res.json({ message: 'Logged out (token invalidation not implemented in this demo)' })
})

// Simulated Google Signin (frontend should verify token with Google)
router.post('/google-signin', (req, res) => {
  const { email, name } = req.body
  if (!email) return res.status(400).json({ error: 'email required' })
  let user = users.find(u => u.email === email)
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: name || 'Google User',
      email,
      passwordHash: null,
      mobile: null,
      userCode: generate6DigitCode(),
      emailVerified: true,
      verificationToken: null,
      createdAt: new Date().toISOString()
    }
    users.push(user)
  }
  return res.json({ id: user.id, name: user.name, email: user.email, userCode: user.userCode })
})

// Verify email (accepts email + token)
router.post('/verify-email', (req, res) => {
  const { email, token } = req.body
  if (!email || !token) return res.status(400).json({ error: 'email and token required' })
  const user = users.find(u => u.email === email)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.emailVerified) return res.status(400).json({ error: 'Email already verified' })
  if (user.verificationToken !== token) return res.status(400).json({ error: 'Invalid token' })
  user.emailVerified = true
  user.verificationToken = null
  return res.json({ message: 'Email verified' })
})

module.exports = router
