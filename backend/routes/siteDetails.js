const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/upload')
const pool = require('../../database/db/db')
const clerkAuth = require('../middleware/clerkAuth')

// --- siteinformation routes ---
router.post('/siteinformation', clerkAuth, upload.fields([{ name: 'sitelogourl', maxCount: 1 }]), async (req, res) => {
  const { tenantid, sitetitle, sitesubtitle, trustedtagline, sitedescription } = req.body

  if (!tenantid || !sitetitle) {
    return res.status(400).json({ error: 'tenantid and sitetitle are required' })
  }

  console.log('Received siteinformation data:', tenantid, sitetitle, sitesubtitle, trustedtagline, sitedescription ) // Debug log
  try {
    const existingRow = await pool.query('SELECT sitelogourl FROM siteinformation WHERE tenantid = $1', [tenantid])
    const existingLogo = existingRow.rows[0]?.sitelogourl || null

    const sitelogourl = req.files?.sitelogourl
      ? {
          filename: req.files.sitelogourl[0].originalname,
          size: req.files.sitelogourl[0].size,
          url: `/uploads/${req.files.sitelogourl[0].filename}`,
        }
      : existingLogo

    const result = await pool.query(
      `INSERT INTO siteinformation (tenantid, sitelogourl, sitetitle, sitesubtitle, trustedtagline, sitedescription, updatedat)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (tenantid) DO UPDATE SET
          sitelogourl = EXCLUDED.sitelogourl,
          sitetitle = EXCLUDED.sitetitle,
         sitesubtitle = EXCLUDED.sitesubtitle,
         trustedtagline = EXCLUDED.trustedtagline,
         sitedescription = EXCLUDED.sitedescription,
         updatedat = NOW()
       RETURNING *`,
      [tenantid, sitelogourl ? JSON.stringify(sitelogourl) : null, sitetitle, sitesubtitle || null, trustedtagline || null, sitedescription || null],
    )

    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving siteinformation:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

router.get('/siteinformation/:tenantid', async (req, res) => {
  const { tenantid } = req.params
  try {
    const result = await pool.query('SELECT * FROM siteinformation WHERE tenantid = $1', [tenantid])
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Not found' })
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching siteinformation:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// --- admincontact routes ---
router.post('/admincontact', clerkAuth, async (req, res) => {
  const { tenantid, contactemail, contactphone, alternatecontactphone, address } = req.body

  if (!tenantid) return res.status(400).json({ error: 'tenantid is required' })

  try {
    const result = await pool.query(
      `INSERT INTO admincontact (tenantid, contactemail, contactphone, alternatecontactphone, address, updatedat)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (tenantid) DO UPDATE SET
         contactemail = EXCLUDED.contactemail,
         contactphone = EXCLUDED.contactphone,
         alternatecontactphone = EXCLUDED.alternatecontactphone,
         address = EXCLUDED.address,
         updatedat = NOW()
       RETURNING *`,
      [tenantid, contactemail || null, contactphone || null, alternatecontactphone || null, address || null],
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving admincontact:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

router.get('/admincontact/:tenantid', async (req, res) => {
  const { tenantid } = req.params
  try {
    const result = await pool.query('SELECT * FROM admincontact WHERE tenantid = $1', [tenantid])
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Not found' })
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching admincontact:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// --- adminsocial routes ---
router.post('/adminsocial', clerkAuth, async (req, res) => {
  const { tenantid, instagramurl, googlemapurl, justdialurl } = req.body
  console.log('Received adminsocial data:', req.body) // Debug log
  if (!tenantid) return res.status(400).json({ error: 'tenantid is required' })

  try {
    const result = await pool.query(
      `INSERT INTO adminsocial (tenantid, instagramurl, googlemapurl, justdialurl, updatedat)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (tenantid) DO UPDATE SET
         instagramurl = EXCLUDED.instagramurl,
         googlemapurl = EXCLUDED.googlemapurl,
         justdialurl = EXCLUDED.justdialurl,
         updatedat = NOW()
       RETURNING *`,
      [tenantid, instagramurl || null, googlemapurl || null, justdialurl || null],
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving adminsocial:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

router.get('/adminsocial/:tenantid', async (req, res) => {
  const { tenantid } = req.params
  try {
    const result = await pool.query('SELECT * FROM adminsocial WHERE tenantid = $1', [tenantid])
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Not found' })
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching adminsocial:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// --- openinghours routes ---
router.post('/openinghours', clerkAuth, async (req, res) => {
  const { tenantid, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body

  if (!tenantid) return res.status(400).json({ error: 'tenantid is required' })

  try {
    const result = await pool.query(
      `INSERT INTO openinghours (tenantid, monday, tuesday, wednesday, thursday, friday, saturday, sunday, updatedat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (tenantid) DO UPDATE SET
         monday = EXCLUDED.monday,
         tuesday = EXCLUDED.tuesday,
         wednesday = EXCLUDED.wednesday,
         thursday = EXCLUDED.thursday,
         friday = EXCLUDED.friday,
         saturday = EXCLUDED.saturday,
         sunday = EXCLUDED.sunday,
         updatedat = NOW()
       RETURNING *`,
      [tenantid, monday || '', tuesday || '', wednesday || '', thursday || '', friday || '', saturday || '', sunday || ''],
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving openinghours:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

router.get('/openinghours/:tenantid', async (req, res) => {
  const { tenantid } = req.params
  try {
    const result = await pool.query('SELECT * FROM openinghours WHERE tenantid = $1', [tenantid])
    // if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Not found' })
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching openinghours:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

module.exports = router


