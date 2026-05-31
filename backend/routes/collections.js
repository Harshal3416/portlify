const express = require('express')
const crypto = require('crypto')
const multer = require('multer')
const router = express.Router()
const { collections } = require('../utils/store')
const pool = require('../database/db/db')
const clerkAuth = require('../middleware/clerkAuth')
const {
  COLLECTION_ASSETS_BUCKET,
  uploadFileToSupabase,
  enrichItemAssets,
} = require('../utils/supabase')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024,
    fields: 20,
    files: 10,
  },
})

const buildAssetFromFile = async (file, tenantid, type) => {
  const folder = type === 'image' ? 'images' : 'videos'
  const { filePath, publicUrl } = await uploadFileToSupabase(
    COLLECTION_ASSETS_BUCKET,
    file,
    { tenantid, folder },
  )

  return {
    type,
    filename: file.originalname,
    size: file.size,
    filePath,
    url: publicUrl,
  }
}

const assetsFromFiles = async (files, tenantid) => {
  const images = []
  const videos = []

  for (const file of files) {
    if (file.mimetype.startsWith('image/')) {
      images.push(await buildAssetFromFile(file, tenantid, 'image'))
    } else if (file.mimetype.startsWith('video/')) {
      videos.push(await buildAssetFromFile(file, tenantid, 'video'))
    }
  }

  return { images, videos }
}

const enrichCollectionRow = (row) => {
  if (!row) return row
  return {
    ...row,
    itemassets: enrichItemAssets(row.itemassets),
  }
}

// Create item (multipart/form-data; files uploaded to Supabase Storage)
router.post(
  '/',
  clerkAuth,
  upload.fields([{ name: 'itemassets', maxCount: 10 }]),
  async (req, res) => {
    try {
      const { itemid, itemname, description, tenantid, price } = req.body

      if (!itemid || !itemname || !tenantid) {
        return res.status(400).json({
          success: false,
          error: 'itemid, itemname and tenantid are required',
        })
      }

      const allFiles = req.files?.itemassets || []
      const itemassets = await assetsFromFiles(allFiles, tenantid)

      const id = crypto.randomUUID()

      const result = await pool.query(
        `INSERT INTO collections 
         (id, tenantid, itemid, itemname, description, itemassets, price, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [id, tenantid, itemid, itemname, description || '', itemassets, price],
      )

      return res.status(201).json({
        success: true,
        data: enrichCollectionRow(result.rows[0]),
      })
    } catch (err) {
      console.error('Error creating collection:', err)

      if (err.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'itemid already exists',
        })
      }

      return res.status(500).json({
        success: false,
        error: 'Server error: ' + err.message,
      })
    }
  },
)

// List all collections
router.get('/', async (req, res) => {
  const { tenantid } = req.query
  console.log('Get Collection: Tenant ID IN BACKEND', tenantid)
  try {
    let result
    if (tenantid) {
      result = await pool.query(
        'SELECT * FROM collections WHERE tenantid = $1 ORDER BY createdAt DESC',
        [tenantid],
      )
    } else {
      result = await pool.query(
        'SELECT * FROM collections ORDER BY createdAt DESC',
      )
    }

    return res.status(200).json({
      success: true,
      data: result.rows.map(enrichCollectionRow),
    })
  } catch (err) {
    console.error('Error fetching collections:', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Get item by itemid
router.get('/:itemid', (req, res) => {
  const { itemid } = req.params
  const item = collections.find((p) => p.itemid === itemid)
  if (!item) return res.status(404).json({ success: false, error: 'Item not found' })
  return res.json({ success: true, data: item })
})

// Update item by itemid
router.put(
  '/:itemid',
  clerkAuth,
  upload.fields([{ name: 'itemassets', maxCount: 10 }]),
  async (req, res) => {
    try {
      const { itemid } = req.params
      const { itemname, description, tenantid, price } = req.body

      if (!tenantid) {
        return res.status(400).json({
          success: false,
          error: 'tenantid is required',
        })
      }

      let itemassets
      let existingAssets = []

      if (req.body.existingAssets) {
        try {
          existingAssets = JSON.parse(req.body.existingAssets)
        } catch (e) {
          console.warn('Failed to parse existingAssets payload:', e)
        }
      }

      const existingImages = Array.isArray(existingAssets)
        ? existingAssets.filter((asset) => asset.type === 'image')
        : []
      const existingVideos = Array.isArray(existingAssets)
        ? existingAssets.filter((asset) => asset.type === 'video')
        : []

      if (req.files?.itemassets || req.body.existingAssets !== undefined) {
        const allFiles = req.files?.itemassets || []
        const uploaded = await assetsFromFiles(allFiles, tenantid)

        itemassets = {
          images: [...existingImages, ...uploaded.images],
          videos: [...existingVideos, ...uploaded.videos],
        }
      }

      let query
      let params

      if (itemassets) {
        query = `
          UPDATE collections 
          SET itemname = $1,
              description = $2,
              price = $3,
              itemassets = $4,
              updatedAt = NOW()
          WHERE itemid = $5 AND tenantid = $6
          RETURNING *`
        params = [itemname, description, price, itemassets, itemid, tenantid]
      } else {
        query = `
          UPDATE collections 
          SET itemname = $1,
              description = $2,
              price = $3,
              updatedAt = NOW()
          WHERE itemid = $4 AND tenantid = $5
          RETURNING *`
        params = [itemname, description, price, itemid, tenantid]
      }

      const result = await pool.query(query, params)

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Item not found',
        })
      }

      return res.json({
        success: true,
        data: enrichCollectionRow(result.rows[0]),
      })
    } catch (err) {
      console.error('Update error:', err)

      return res.status(500).json({
        success: false,
        error: 'Server error: ' + err.message,
      })
    }
  },
)

// Delete item by itemid
router.delete('/:itemid', clerkAuth, async (req, res) => {
  const { itemid } = req.params

  const result = await pool.query('DELETE FROM collections WHERE itemid = $1 RETURNING *', [itemid])

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Item not found' })
  }

  return res.json({ success: true, message: 'Item deleted', data: result.rows[0] })
})

module.exports = router
