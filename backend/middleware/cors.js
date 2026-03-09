// Simple CORS middleware (allow all origins). Replace with the `cors` package for finer control.
function corsMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return res.sendStatus(204)
  }
  next()
}

module.exports = corsMiddleware
