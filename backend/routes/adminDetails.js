// backend/routes/adminDetails.js
const express = require('express')
const router = express.Router()
const pool = require("../database/db/db");
const clerkAuth = require('../middleware/clerkAuth')

// POST — save admin details for logged-in user
router.post("/", clerkAuth, async (req, res) => {
  const { tenantid, ownername, ownertitle, aboutowner, yearsofexperience, productssold, happyclients} = req.body;
  const clerkId = req.clerkId; // injected by middleware

  if (!tenantid) {
    return res
      .status(400)
      .json({ error: "tenantid and tenantdomain are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO admindetails (clerkid, tenantid, ownername, ownertitle, aboutowner,  yearsofexperience, productssold, happyclients)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   ON CONFLICT (clerkid) DO UPDATE
   SET 
     tenantid = EXCLUDED.tenantid,
     ownername = EXCLUDED.ownername,
     ownertitle = EXCLUDED.ownertitle,
     aboutowner = EXCLUDED.aboutowner,
     yearsofexperience = EXCLUDED.yearsofexperience,
     productssold = EXCLUDED.productssold,
     happyclients = EXCLUDED.happyclients
   RETURNING *`,
      [clerkId, tenantid, ownername, ownertitle, aboutowner, yearsofexperience, productssold, happyclients],
    );

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Tenant ID already exists. Please choose another.",
      });
    }

    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET — fetch admin details for logged-in user
router.get("/", clerkAuth, async (req, res) => {
  const clerkId = req.clerkId; // injected by middleware

  try {
    const result = await pool.query(
      "SELECT * FROM admindetails WHERE clerkid = $1",
      [clerkId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin details not found' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// GET — fetch admin details by tenantid for public users
router.get("/:tenantid", async (req, res) => {
  const { tenantid } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM admindetails WHERE tenantid = $1",
      [tenantid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin details not found' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router