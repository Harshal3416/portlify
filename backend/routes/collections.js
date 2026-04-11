const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { collections } = require('../utils/store')
const pool = require("../../database/db/db");
const clerkAuth = require('../middleware/clerkAuth')

// Create item (multipart/form-data only; files are stored and URLs provided)
router.post(
  "/",
  clerkAuth,
  upload.fields([{ name: "itemassets", maxCount: 10 }]),
  async (req, res) => {
    try {
      const { itemid, itemname, description, tenantid, price} = req.body;

      if (!itemid || !itemname || !tenantid) {
        return res.status(400).json({
          success: false,
          error: "itemid, itemname and tenantid are required",
        });
      }

      const allFiles = req.files?.itemassets || [];

      const images = allFiles
        .filter((f) => f.mimetype.startsWith("image/"))
        .map((f) => ({
          type: "image",
          filename: f.originalname,
          size: f.size,
          url: `/uploads/${f.filename}`,
        }));

      const videos = allFiles
        .filter((f) => f.mimetype.startsWith("video/"))
        .map((f) => ({
          type: "video",
          filename: f.originalname,
          size: f.size,
          url: `/uploads/${f.filename}`,
        }));

      // ✅ Combined JSONB structure
      const itemassets = {
        images,
        videos,
      };

      const id = crypto.randomUUID();

      const result = await pool.query(
        `INSERT INTO collections 
         (id, tenantid, itemid, itemname, description, itemassets, price, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [id, tenantid, itemid, itemname, description || "", itemassets, price || 0],
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Error creating collection:", err);

      // ✅ Handle duplicate itemid error
      if (err.code === "23505") {
        return res.status(400).json({
          success: false,
          error: "itemid already exists",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Server error: " + err.message,
      });
    }
  },
);

// List all collections
router.get('/', async (req, res) => {
  const { tenantid } = req.query; // read from query string
  console.log("Get Collection: Tenant ID IN BACKEND", tenantid)
    try {
      if (tenantid) {
        result = await pool.query(
          "SELECT * FROM collections WHERE tenantid = $1 ORDER BY createdAt DESC",
          [tenantid],
        );
      } else {
        result = await pool.query(
          "SELECT * FROM collections ORDER BY createdAt DESC",
        );
      }

      return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      console.error("Error fetching collections:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
})

// Get item by itemid
router.get('/:itemid', (req, res) => {
  const { itemid } = req.params
  const item = collections.find(p => p.itemid === itemid)
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
      const { itemid } = req.params;
      const { itemname, description, tenantid, price} = req.body;

      if (!tenantid) {
        return res.status(400).json({
          success: false,
          error: 'tenantid is required',
        });
      }

      let itemassets;

      if (req.files?.itemassets) {
        const allFiles = req.files.itemassets;

        const images = allFiles
          .filter(f => f.mimetype.startsWith('image/'))
          .map(f => ({
            type: 'image',
            filename: f.originalname,
            size: f.size,
            url: `/uploads/${f.filename}`,
          }));

        const videos = allFiles
          .filter(f => f.mimetype.startsWith('video/'))
          .map(f => ({
            type: 'video',
            filename: f.originalname,
            size: f.size,
            url: `/uploads/${f.filename}`,
          }));

        itemassets = { images, videos };
      }

      let query;
      let params;

      if (itemassets) {
        query = `
          UPDATE collections 
          SET itemname = $1,
              description = $2,
              price = $3,
              itemassets = $4,
              updatedAt = NOW()
          WHERE itemid = $5 AND tenantid = $6
          RETURNING *`;
        params = [itemname, description, price, itemassets, itemid, tenantid];
      } else {
        query = `
          UPDATE collections 
          SET itemname = $1,
              description = $2,
              price = $3,
              updatedAt = NOW()
          WHERE itemid = $4 AND tenantid = $5
          RETURNING *`;
        params = [itemname, description, price, itemid, tenantid];
      }

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Item not found',
        });
      }

      return res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (err) {
      console.error('Update error:', err);

      return res.status(500).json({
        success: false,
        error: 'Server error: ' + err.message,
      });
    }
  }
);

// Delete item by itemid
router.delete('/:itemid', clerkAuth, async (req, res) => {
  const { itemid } = req.params
  // const idx = collections.findIndex(p => p.itemid === itemid)

  const result = await pool.query("DELETE FROM collections WHERE itemid = $1 RETURNING *", [itemid])

  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Item not found' })
  // const removed = collections.splice(idx, 1)[0]
  return res.json({ success: true, message: 'Item deleted', data: result.rows[0] })
})

module.exports = router
