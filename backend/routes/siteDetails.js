const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { getSiteDetails, setSiteDetails } = require('../utils/store')
const pool = require("../../database/db/db");

// Update site details
router.post('/', upload.fields([{ name: 'sitelogourl', maxCount: 1 }]), async (req, res) => {
  const {
    tenantid, sitetitle, ownername, sitedescription, contactemail,
    contactphone, alternatecontactphone, address,
    instagramurl, googleurl, justdialurl,
    monday, tuesday, wednesday, thursday, friday, saturday, sunday,
  } = req.body

  if (!tenantid || !sitetitle) {
    return res.status(400).json({ error: 'tenantid and sitetitle are required' })
  }

  // Fetch existing logo to preserve if no new file
  const existingResult = await pool.query("SELECT sitelogourl FROM sitedetails WHERE tenantid = $1", [tenantid]);
  const existingLogo = existingResult.rows[0]?.sitelogourl || null;

  const siteDetails = {
    tenantid,
    sitetitle,
    sitelogourl: req.files?.sitelogourl
      ? {
          filename: req.files.sitelogourl[0].originalname,
          size: req.files.sitelogourl[0].size,
          url: `/uploads/${req.files.sitelogourl[0].filename}`,
        }
      : existingLogo,
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

  // UPSERT into DB - update if exists, insert if not
  const result = await pool.query(
    `INSERT INTO sitedetails 
     (tenantid, sitetitle, sitelogourl, ownername, sitedescription, contactemail, contactphone, alternatecontactphone, address, instagramurl, googleurl,
     justdialurl, monday, tuesday, wednesday, thursday, friday, saturday, sunday, updatedat)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
       $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
     ON CONFLICT (tenantid) DO UPDATE SET
       sitetitle = EXCLUDED.sitetitle,
       sitelogourl = EXCLUDED.sitelogourl,
       ownername = EXCLUDED.ownername,
       sitedescription = EXCLUDED.sitedescription,
       contactemail = EXCLUDED.contactemail,
       contactphone = EXCLUDED.contactphone,
       alternatecontactphone = EXCLUDED.alternatecontactphone,
       address = EXCLUDED.address,
       instagramurl = EXCLUDED.instagramurl,
       googleurl = EXCLUDED.googleurl,
       justdialurl = EXCLUDED.justdialurl,
       monday = EXCLUDED.monday,
       tuesday = EXCLUDED.tuesday,
       wednesday = EXCLUDED.wednesday,
       thursday = EXCLUDED.thursday,
       friday = EXCLUDED.friday,
       saturday = EXCLUDED.saturday,
       sunday = EXCLUDED.sunday,
       updatedat = EXCLUDED.updatedat
     RETURNING *`,
    [
      tenantid,
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

  // setSiteDetails(result.rows[0])
  return res.status(201).json({ success: true, data: result.rows[0] });
})

// Get site details
router.get("/:tenantid", async (req, res) => {
  const { tenantid } = req.params;
  try {
    const result = await pool.query(
      "SELECT * from sitedetails WHERE tenantid = $1",
      [tenantid],
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

module.exports = router

