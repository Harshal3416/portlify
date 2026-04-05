const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { products } = require('../utils/store')
const pool = require("../../database/db/db");
const clerkAuth = require('../middleware/clerkAuth')

// Create product (multipart/form-data only; files are stored and URLs provided)
router.post(
  '/',
  clerkAuth,
  upload.fields([
    { name: 'highlightimage', maxCount: 1 },
    { name: 'otherimages', maxCount: 6 },
    { name: 'videos', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('Received product creation request with body:', req.body)
    try {
      const { productid, name, description, tenantid } = req.body
      if (!productid || !name) return res.status(400).json({ success: false, error: 'productid and name are required' })
      console.log('products', products)
      // const exists = products.find(p => p.productid === productid)
      // if (exists) return res.status(409).json({ success: false, error: 'Product with this ID already exists' })

      const product = {
        id: crypto.randomUUID(),
        productid,
        name,
        description: description || '',
        tenantid,
        highlightimage: req.files?.highlightimage
          ? { filename: req.files.highlightimage[0].originalname, size: req.files.highlightimage[0].size, url: `/uploads/${req.files.highlightimage[0].filename}` }
          : null,
        otherimages: req.files?.otherimages
          ? req.files.otherimages.map(f => ({ filename: f.originalname, size: f.size, url: `/uploads/${f.filename}` })).slice(0, 6)
          : [],
        videos: req.files?.videos
          ? req.files.videos.map(f => ({ filename: f.originalname, size: f.size, url: `/uploads/${f.filename}` })).slice(0, 1)
          : [],
        createdat: new Date().toISOString(),
      }

      // Insert into DB
      const result = await pool.query(
        `INSERT INTO products 
         (id, tenantid, productid, name, description, highlightimage, otherimages, videos, createdat)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          product.id,
          product.tenantid,
          product.productid,
          product.name,
          product.description,
          product.highlightimage,
          product.otherimages,
          product.videos,
          product.createdat,
        ]
      );

      return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Server error: ' + err.message })
    }
  }
)

// List all products
router.get('/', async (req, res) => {
  const { tenantid } = req.query; // read from query string
  console.log("SHOP ID IN BACKEND", tenantid)
    try {
      if (tenantid) {
        result = await pool.query(
          "SELECT * FROM products WHERE tenantid = $1 ORDER BY createdat DESC",
          [tenantid],
        );
      } else {
        result = await pool.query(
          "SELECT * FROM products ORDER BY createdat DESC",
        );
      }

      return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      console.error("Error fetching products:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
})

// Get product by productid
router.get('/:productid', (req, res) => {
  const { productid } = req.params
  const product = products.find(p => p.productid === productid)
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
  return res.json({ success: true, data: product })
})

// Update product by productid
router.put('/:productid', clerkAuth, upload.fields([
    { name: 'highlightimage', maxCount: 1 }
  ]), async (req, res) => {
  const { productid } = req.params
  console.log("EDITING PRODUCT", req.body)
  const { name, description, tenantid } = req.body
  
  // Only update highlightimage if a new file is provided
  let query = "UPDATE PRODUCTS SET name = $1, description = $2";
  let params = [name, description, productid];
  
  if (req.files?.highlightimage) {
    const highlightimage = {
      filename: req.files.highlightimage[0].originalname,
      size: req.files.highlightimage[0].size,
      url: `/uploads/${req.files.highlightimage[0].filename}`,
    };
    query = "UPDATE PRODUCTS SET name = $1, description = $2, highlightimage = $3 WHERE productid = $4 RETURNING *";
    params = [name, description, highlightimage, productid];
  } else {
    query += " WHERE productid = $3 RETURNING *";
  }
  
  const product = await pool.query(query, params)
    // if (tenantid) {
    //     result = await pool.query(
    //       "SELECT * FROM products WHERE tenantid = $1 ORDER BY createdat DESC",
    //       [tenantid],
    //     );
    //   } 
  if (!product) return res.status(404).json({ error: 'Product not found' })
  // if (otherimages && otherimages.length > 6) return res.status(400).json({ error: 'otherimages max 6' })
  // if (videos && videos.length > 1) return res.status(400).json({ error: 'videos max 1' })

  product.name = name || product.name
  product.description = description || product.description
  if(product.highlightimage) {
    product.highlightimage = highlightimage !== undefined ? highlightimage : product.highlightimage
  }
  // product.otherimages = Array.isArray(otherimages) ? otherimages.slice(0, 6) : product.otherimages
  // product.videos = Array.isArray(videos) ? videos.slice(0, 1) : product.videos
  // product.updatedat = new Date().toISOString()

  return res.json(product)
})

// Delete product by productid
router.delete('/:productid', clerkAuth, async (req, res) => {
  const { productid } = req.params
  // const idx = products.findIndex(p => p.productid === productid)

  const product = await pool.query("DELETE FROM PRODUCTS WHERE productid = $1 RETURNING *", [productid])

  if (product.success === false) return res.status(404).json({ error: 'Product not found' })
  // const removed = products.splice(idx, 1)[0]
  return res.json({ message: 'Product deleted', product })
})

module.exports = router
