const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Site } = require("./../models/site");
const { auth } = require("./../middleware/auth");
const { admin } = require("./../middleware/admin");
const { normalizeErrors } = require("./../helpers/mongoose");

// Route /api/site/site_data
router.get("/site_data", (req, res) => {
  Site.find({})
    .then(site => {
      res.send(site[0].siteInfo);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// Route /api/site/site_data
router.post("/site_data", auth, admin, (req, res) => {
  Site.findOneAndUpdate(
    { name: "Site" },
    { $set: { siteInfo: req.body } },
    { new: true }
  )
    .then(doc => {
      res.send({
        siteInfo: doc.siteInfo
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

module.exports = router;
