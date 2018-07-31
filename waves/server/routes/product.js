const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Brand } = require("./../models/brand");
const { Wood } = require("./../models/wood");
const { Product } = require("./../models/product");
const { auth } = require("./../middleware/auth");
const { admin } = require("./../middleware/admin");
const { normalizeErrors } = require("./../helpers/mongoose");

// ROUTE  /api/product/article
// Admin can input product
router.post("/article", auth, admin, (req, res) => {
  const product = new Product(req.body);

  product
    .save()
    .then(product => {
      res.json({
        success: true,
        article: product
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

/// /api/product/articles_by_id?id=HSHSHSKSK,JSJSJSJS,SDSDHHSHDS,JSJJSDJ&type=single
// GEt products by ID
router.get("/articles_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item); //Converts to object id
    });
  }

  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec()
    .then(docs => {
      res.send(docs);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// BY ARRIVAL
// /api/product/articles?sortBy=createdAt&order=desc&limit=4
// BY SELL
// /api/product/articles?sortBy=sold&order=desc&limit=100
// Allow user to customize products to be seen
router.get("/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec()
    .then(articles => {
      res.send(articles);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

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
// Get all woods
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
