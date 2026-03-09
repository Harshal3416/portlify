const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { products } = require('../utils/store')

// Create product (multipart/form-data only; files are stored and URLs provided)
router.post(
  '/',
  upload.fields([
    { name: 'highlightImage', maxCount: 1 },
    { name: 'otherImages', maxCount: 6 },
    { name: 'videos', maxCount: 1 },
  ]),
  (req, res) => {
    console.log('Received product creation request with body:', req.body)
    try {
      const { productId, name, description } = req.body
      if (!productId || !name) return res.status(400).json({ success: false, error: 'productId and name are required' })
      console.log('products', products)
      const exists = products.find(p => p.productId === productId)
      if (exists) return res.status(409).json({ success: false, error: 'Product with this ID already exists' })

      const product = {
        id: crypto.randomUUID(),
        productId,
        name,
        description: description || '',
        highlightImage: req.files?.highlightImage
          ? { filename: req.files.highlightImage[0].originalname, size: req.files.highlightImage[0].size, url: `/uploads/${req.files.highlightImage[0].filename}` }
          : null,
        otherImages: req.files?.otherImages
          ? req.files.otherImages.map(f => ({ filename: f.originalname, size: f.size, url: `/uploads/${f.filename}` })).slice(0, 6)
          : [],
        videos: req.files?.videos
          ? req.files.videos.map(f => ({ filename: f.originalname, size: f.size, url: `/uploads/${f.filename}` })).slice(0, 1)
          : [],
        createdAt: new Date().toISOString(),
      }
      products.push(product)
      return res.status(201).json({ success: true, data: product })
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error: ' + err.message })
    }
  }
)

// List all products
router.get('/', (req, res) => {
  return res.json(products)
})

// Get product by productId
router.get('/:productId', (req, res) => {
  const { productId } = req.params
  const product = products.find(p => p.productId === productId)
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
  return res.json({ success: true, data: product })
})

// Update product by productId
router.put('/:productId', (req, res) => {
  const { productId } = req.params
  const { name, description, highlightImage, otherImages, videos } = req.body
  const product = products.find(p => p.productId === productId)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (otherImages && otherImages.length > 6) return res.status(400).json({ error: 'otherImages max 6' })
  if (videos && videos.length > 1) return res.status(400).json({ error: 'videos max 1' })

  product.name = name || product.name
  product.description = description || product.description
  product.highlightImage = highlightImage !== undefined ? highlightImage : product.highlightImage
  product.otherImages = Array.isArray(otherImages) ? otherImages.slice(0, 6) : product.otherImages
  product.videos = Array.isArray(videos) ? videos.slice(0, 1) : product.videos
  product.updatedAt = new Date().toISOString()

  return res.json(product)
})

// Delete product by productId
router.delete('/:productId', (req, res) => {
  const { productId } = req.params
  const idx = products.findIndex(p => p.productId === productId)
  if (idx === -1) return res.status(404).json({ error: 'Product not found' })
  const removed = products.splice(idx, 1)[0]
  return res.json({ message: 'Product deleted', product: removed })
})

module.exports = router
