const bcrypt = require('bcrypt')

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000)
}

module.exports = { hashPassword, generate6DigitCode, comparePassword }
