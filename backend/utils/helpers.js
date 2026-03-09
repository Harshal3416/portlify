const crypto = require('crypto')

// Hash password using SHA-256 (for demo only, use bcrypt/scrypt in production)
// NOTE: This is NOT secure for production use. Use a proper password hashing library like bcrypt or scrypt.
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000)
}

module.exports = { hashPassword, generate6DigitCode }
