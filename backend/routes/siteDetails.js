const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { getSiteDetails, setSiteDetails } = require('../utils/store')
const pool = require("../../database/db/db");

// Update site details
router.post('/', upload.fields([{ name: 'sitelogourl', maxCount: 1 }]), async (req, res) => {
  const {
    shopid, sitetitle, ownername, sitedescription, contactemail,
    contactphone, alternatecontactphone, address,
    instagramurl, googleurl, justdialurl,
    monday, tuesday, wednesday, thursday, friday, saturday, sunday,
  } = req.body

  if (!shopid || !sitetitle || !ownername || !sitedescription || !contactemail) {
    return res.status(400).json({ error: 'shopid, sitetitle, ownername, sitedescription and contactemail are required' })
  }

  const siteDetails = {
    shopid,
    sitetitle,
    sitelogourl: req.files?.sitelogourl
      ? {
          filename: req.files.sitelogourl[0].originalname,
          size: req.files.sitelogourl[0].size,
          url: `/uploads/${req.files.sitelogourl[0].filename}`,
        }
      : null,
    ownername,
    sitedescription,
    contactemail,
    contactphone: contactphone || null,
    alternatecontactphone: alternatecontactphone || null,
    address: address || null,
    instagramurl: instagramurl || null,
    googleurl: googleurl || null,
    justdialurl: justdialurl || null,
    monday: monday || '',
    tuesday: tuesday || '',
    wednesday: wednesday || '',
    thursday: thursday || '',
    friday: friday || '',
    saturday: saturday || '',
    sunday: sunday || '',
    updatedat: new Date().toISOString(),
  }

        // Insert into DB
      const result = await pool.query(
        `INSERT INTO sitedetails 
         (shopid, sitetitle, sitelogourl, ownername, sitedescription, contactemail, contactphone, alternatecontactphone, address, instagramurl, googleurl,
         justdialurl, monday, tuesday, wednesday, thursday, friday, saturday, sunday, updatedat)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
           $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [
          shopid,
          sitetitle,
          JSON.stringify(siteDetails.sitelogourl), 
          ownername,
          sitedescription, 
          contactemail, 
          contactphone, 
          alternatecontactphone,
          address,
          instagramurl, 
          googleurl, 
          justdialurl, 
          monday, 
          tuesday, 
          wednesday, 
          thursday, 
          friday, 
          saturday, 
          sunday,
          siteDetails.updatedat
        ]
      );

      setSiteDetails(result.rows[0])
      return res.status(201).json({ success: true, data: result.rows[0] });

  // console.log('Updated site details:', getSiteDetails())
  return res.json({ success: true, data: siteDetails })
})

// Get site details
router.get('/', (req, res) => {
  console.log('Send site details:', getSiteDetails())
  return res.json(getSiteDetails())
})

module.exports = router
