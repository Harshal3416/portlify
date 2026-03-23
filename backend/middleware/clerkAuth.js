const { verifyToken } = require('@clerk/backend')

async function clerkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1];
    // console.log("JWT KEY", process.env.CLERK_JWT_KEY, process.env.CLERK_SECRET_KEY)
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      jwtKey: process.env.CLERK_JWT_KEY // TODO: remove if not required
    })
    req.clerkId = payload.sub  // attach userId to request
    next() // VERY IMPORTANT
  } catch (err) {
    console.error('Clerk auth error:', err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = clerkAuth