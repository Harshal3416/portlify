const express = require("express");
const router = express.Router();
const pool = require("../database/db/db");

// ============================================
// Get all businesses (aggregated from admin/site/contact tables)
// ============================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         ad.tenantid,
         si.sitelogourl,
         si.sitetitle,
         ad.ownername,
         ad.shoptype,
         si.sitedescription,
         ac.address
       FROM admindetails ad
       LEFT JOIN siteinformation si ON ad.tenantid = si.tenantid
       LEFT JOIN admincontact ac ON ad.tenantid = ac.tenantid
       ORDER BY ad.tenantid ASC`
    );

    const data = result.rows.map((row) => {
      let siteLogo = row.sitelogourl || null;
      if (typeof siteLogo === "string" && siteLogo) {
        try {
          siteLogo = JSON.parse(siteLogo);
        } catch (parseErr) {
          siteLogo = siteLogo;
        }
      }

      return {
        tenantid: row.tenantid,
        siteLogo,
        siteTitle: row.sitetitle || null,
        ownerName: row.ownername || null,
        shopType: row.shoptype || null,
        siteDescription: row.sitedescription || null,
        address: row.address || null,
      };
    });

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (err) {
    console.error("Error fetching businesses:", err);
    return res.status(500).json({
      success: false,
      error: "Server error: " + err.message,
    });
  }
});

module.exports = router;
