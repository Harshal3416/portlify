const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/upload')
const { getSiteDetails, setSiteDetails } = require('../utils/store')

// Update site details
router.post('/', upload.fields([{ name: 'siteLogoUrl', maxCount: 1 }]), (req, res) => {
  const {
    siteTitle, ownerName, siteDescription, contactEmail,
    contactPhone, alternateContactPhone, address,
    instagramUrl, googleUrl, justDialUrl,
    monday, tuesday, wednesday, thursday, friday, saturday, sunday,
  } = req.body

  if (!siteTitle || !ownerName || !siteDescription || !contactEmail) {
    return res.status(400).json({ error: 'siteTitle, ownerName, siteDescription and contactEmail are required' })
  }

  const siteDetails = {
    siteTitle,
    siteLogoUrl: req.files?.siteLogoUrl
      ? {
          filename: req.files.siteLogoUrl[0].originalname,
          size: req.files.siteLogoUrl[0].size,
          url: `/uploads/${req.files.siteLogoUrl[0].filename}`,
        }
      : null,
    ownerName,
    siteDescription,
    contactEmail,
    contactPhone: contactPhone || null,
    alternateContactPhone: alternateContactPhone || null,
    address: address || null,
    instagramUrl: instagramUrl || null,
    googleUrl: googleUrl || null,
    justDialUrl: justDialUrl || null,
    monday: monday || '',
    tuesday: tuesday || '',
    wednesday: wednesday || '',
    thursday: thursday || '',
    friday: friday || '',
    saturday: saturday || '',
    sunday: sunday || '',
    updatedAt: new Date().toISOString(),
  }

  setSiteDetails(siteDetails)
  console.log('Updated site details:', getSiteDetails())
  return res.json({ success: true, data: siteDetails })
})

// Get site details
router.get('/', (req, res) => {
  console.log('Send site details:', getSiteDetails())
  return res.json(getSiteDetails())
})

module.exports = router
