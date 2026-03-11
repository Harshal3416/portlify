const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require("cors");

// const corsMiddleware = require('./middleware/cors')
const { uploadsDir } = require('./middleware/upload')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const siteDetailsRoutes = require('./routes/siteDetails')

const app = express()
const port = process.env.PORT || 3000

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use( cors({ origin: ["http://localhost:4000"], credentials: true }) );


// Routes
app.get('/', (req, res) => res.send('Enquiry App backend'))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/site-details', siteDetailsRoutes)

// Global error handler (catches multer and other errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({ success: false, error: 'File too large (max 10MB)' })
    }
    return res.status(400).json({ success: false, error: 'Upload error: ' + err.message })
  } else if (err) {
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message })
  }
  next()
})

app.listen(port, () => {
  console.log(`Enquiry app listening on port ${port}`)
})
