const express = require('express')
const router = express.Router()
const multer = require('multer')
const pool = require('../database/db/db')
const clerkAuth = require('../middleware/clerkAuth')
const {
  SITE_LOGO_BUCKET,
  uploadImageToSupabase,
  getPublicUrlFromPath,
} = require('../utils/supabase.js')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed for site logo'))
    }
  },
})

/** Parse sitelogourl from DB (json/jsonb string or object). */
const parseSiteLogo = (stored) => {
  if (!stored) return null
  if (typeof stored === 'object') return stored
  if (typeof stored === 'string') {
    try {
      return JSON.parse(stored)
    } catch {
      return { url: stored }
    }
  }
  return null
}

/** Ensure logo metadata includes a usable public URL. */
const enrichSiteLogo = (stored) => {
  const logo = parseSiteLogo(stored)
  if (!logo) return null

  const needsUrl =
    logo.filePath &&
    (!logo.url || (typeof logo.url === 'string' && logo.url.startsWith('/uploads')))

  if (needsUrl) {
    const publicUrl = getPublicUrlFromPath(logo.filePath)
    if (publicUrl) logo.url = publicUrl
  }

  return logo
}

// --- siteinformation routes ---
router.post('/siteinformation', clerkAuth, upload.single('sitelogourl'), async (req, res) => {
  const { tenantid, sitetitle, sitesubtitle, trustedtagline, sitedescription } = req.body

  if (!tenantid || !sitetitle) {
    return res.status(400).json({ error: 'tenantid and sitetitle are required' })
  }

  try {
    let sitelogourl = null

    if (req.file) {
      const uploadResult = await uploadImageToSupabase(
        SITE_LOGO_BUCKET,
        req.file,
        tenantid,
      )

      sitelogourl = {
        filename: req.file.originalname,
        size: req.file.size,
        filePath: uploadResult.filePath,
        url: uploadResult.publicUrl,
      }
    } else {
      const existingRow = await pool.query(
        'SELECT sitelogourl FROM siteinformation WHERE tenantid = $1',
        [tenantid],
      )
      sitelogourl = enrichSiteLogo(existingRow.rows[0]?.sitelogourl)
    }

    const result = await pool.query(
      `INSERT INTO siteinformation (tenantid, sitelogourl, sitetitle, sitesubtitle, trustedtagline, sitedescription, updatedat)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (tenantid) DO UPDATE SET
          sitelogourl = COALESCE(EXCLUDED.sitelogourl, siteinformation.sitelogourl),
          sitetitle = EXCLUDED.sitetitle,
         sitesubtitle = EXCLUDED.sitesubtitle,
         trustedtagline = EXCLUDED.trustedtagline,
         sitedescription = EXCLUDED.sitedescription,
         updatedat = NOW()
       RETURNING *`,
      [
        tenantid,
        sitelogourl ? JSON.stringify(sitelogourl) : null,
        sitetitle,
        sitesubtitle || null,
        trustedtagline || null,
        sitedescription || null,
      ],
    )

    const data = { ...result.rows[0] }
    if (data.sitelogourl) {
      data.sitelogourl = enrichSiteLogo(data.sitelogourl)
    }

    return res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Error saving siteinformation:', error)
    const message =
      error instanceof multer.MulterError
        ? `Upload error: ${error.message}`
        : error.message || 'Internal server error'
    const status = error instanceof multer.MulterError || error.message?.includes('image') ? 400 : 500
    return res.status(status).json({ success: false, error: message })
  }
})

router.get('/siteinformation/:tenantid', async (req, res) => {
  const { tenantid } = req.params
  try {
    const result = await pool.query('SELECT * FROM siteinformation WHERE tenantid = $1', [tenantid])

    if (result.rows[0]?.sitelogourl) {
      result.rows[0].sitelogourl = enrichSiteLogo(result.rows[0].sitelogourl)
    }

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
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching admincontact:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// --- adminsocial routes ---
router.post('/adminsocial', clerkAuth, async (req, res) => {
  const { tenantid, instagramurl, googlemapurl, justdialurl } = req.body
  console.log('Received adminsocial data:', req.body)
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
    return res.status(200).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching openinghours:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

module.exports = router
