const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { hashPassword, generate6DigitCode, comparePassword } = require('../utils/helpers')
const { users } = require('../utils/store')
const pool = require("../../database/db/db");

// Register (creates user with 6-digit code and email verification token)
router.post('/register', async (req, res) => {
  const { name, email, password, mobile, shopid } = req.body;
  if (!name || !email || !password || !mobile || !shopid) {
    return res
      .status(400)
      .json({ error: "name, email, password, shopid and mobile are required" });
  }
  const exists = users.find((u) => u.email === email);
  if (exists)
    return res.status(409).json({ error: "Email already registered" });

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordhash: hashPassword(password),
    mobile,
    emailVerified: false,
    verificationToken: crypto.randomUUID(),
    shopid,
    createdat: new Date().toISOString(),
  };

  // Insert into DB
  const result = await pool.query(
    `INSERT INTO usersTest4 
        (name, email, passwordhash, mobile, emailVerified, verificationToken, createdat, shopid) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
    [
      name,
      email,
      user.passwordhash,
      mobile,
      false,
      user.verificationToken,
      new Date().toISOString(),
      shopid
    ],
  );

  // Respond with inserted user
  return res.status(201).json(result.rows[0]);
});

// Login (email + password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  // const user = users.find(u => u.email === email)
  let user = await pool.query("SELECT * FROM usersTest4 WHERE email = $1", [email]);
  user = user.rows[0]
  if (!user) return res.status(401).json({ error: 'User not found' })
    
    // Compare password with stored hash
    const isValid = comparePassword(password, user.passwordhash);
    console.log("user", user, !user, isValid, password, user.passwordhash)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

  // Return minimal user info (token generation omitted)
  return res.json({ id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, shopid: user.shopid })
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
      passwordhash: null,
      mobile: null,
      emailVerified: true,
      verificationToken: null,
      createdat: new Date().toISOString()
    }
    users.push(user)
  }
  return res.json({ id: user.id, name: user.name, email: user.email })
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
