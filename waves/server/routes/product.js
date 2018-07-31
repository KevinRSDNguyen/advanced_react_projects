const express = require("express");
const router = express.Router();
const { Brand } = require("./../models/brand");
const { Wood } = require("./../models/wood");
const { auth } = require("./../middleware/auth");
const { admin } = require("./../middleware/admin");
const { normalizeErrors } = require("./../helpers/mongoose");

// ROUTE  /api/product/wood
// Admin can input new wood category
router.post("/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood
    .save()
    .then(wood => {
      res.json({
        success: true,
        wood
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE  /api/product/woods
// Get all brands
router.get("/woods", (req, res) => {
  Wood.find({})
    .then(woods => {
      res.send(woods);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE  /api/product/brand
// Admin can input new brand category
router.post("/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand
    .save()
    .then(brand => {
      res.json({
        success: true,
        brand
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE  /api/product/brands
// Get all brands
router.get("/brands", (req, res) => {
  Brand.find({})
    .then(brands => {
      res.send(brands);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

module.exports = router;
