// backend/routes/adminDetails.js
const express = require('express')
const router = express.Router()
const pool = require("../../database/db/db");
const clerkAuth = require('../middleware/clerkAuth')

// POST — save admin details for logged-in user
router.post("/", clerkAuth, async (req, res) => {
  const { tenantid, tenantdomain } = req.body;
  const clerkId = req.clerkId  // injected by middleware

  if (!tenantid || !tenantdomain) {
    return res.status(400).json({ error: 'tenantid and tenantdomain are required' })
  }

  try {
    // Upsert — safe for both first-time save and future updates
    const result = await pool.query(
      `INSERT INTO admindetails (clerkid, tenantid, tenantdomain)
       VALUES ($1, $2, $3)
       ON CONFLICT (clerkid) DO UPDATE
         SET tenantid = EXCLUDED.tenantid,
             tenantdomain = EXCLUDED.tenantdomain
       RETURNING *`,
      [clerkId, tenantid, tenantdomain]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
})

// GET — fetch admin details for logged-in user
router.get("/", clerkAuth, async (req, res) => {
  const clerkId = req.clerkId  // injected by middleware

  try {
    const result = await pool.query(
      "SELECT * FROM admindetails WHERE clerkid = $1",
      [clerkId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin details not found' })
    }

    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
})

module.exports = router