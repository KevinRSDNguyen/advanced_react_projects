const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const formidable = require("express-formidable"); //Help us get files on req
const cloudinary = require("cloudinary");
const { User } = require("./../models/user");
const { Product } = require("./../models/product");
const { auth } = require("./../middleware/auth");
const { admin } = require("./../middleware/admin");
const { normalizeErrors } = require("./../helpers/mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ROUTE /api/users/uploadimage
router.post("/uploadimage", auth, admin, formidable(), (req, res) => {
  cloudinary.uploader.upload(
    req.files.file.path,
    result => {
      res.send({
        public_id: result.public_id,
        url: result.url
      });
    },
    {
      //Config Obj for Cloudinary
      public_id: `${Date.now()}`, //Name of uploaded file. Can be anything
      resource_type: "auto" //Tell Cloudinry what files we uploading
    }
  );
});

// ROUTE /api/users/removeimage?public_id=5849534
router.get("/removeimage", auth, admin, (req, res) => {
  let image_id = req.query.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error.result !== "ok") {
      return res
        .status(422)
        .json({ errors: [{ detail: "Could not delete image" }] });
    }

    res.status(200).send("ok");
  });
});

// ROUTE /api/users/auth
router.get("/auth", auth, (req, res) => {
  res.json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  });
});

// ROUTE /api/users/register
router.post("/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(userdata => {
      return res.status(200).json({
        success: true,
        userdata
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE /api/users/login
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return res.status(422).json({
          errors: [{ detail: "Incorrect Email or Password" }]
        });

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.status(400).json({
            errors: [{ detail: "Incorrect Email or Password" }]
          });

        user.generateToken((err, user) => {
          if (err)
            return res.status(422).json({ errors: normalizeErrors(err) });
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true
            });
        });
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE /api/users/logout
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(doc => {
      return res.status(200).send({
        success: true
      });
    })
    .catch(err => {
      return res.status(422).json({ errors: normalizeErrors(err) });
    });
});

// ROUTE /api/users/addToCart
router.post("/addToCart", auth, (req, res) => {
  User.findOne({ _id: req.user._id })
    .then(doc => {
      let duplicate = false;

      doc.cart.forEach(item => {
        if (item.id == req.query.productId) {
          duplicate = true;
        }
      });

      if (duplicate) {
        User.findOneAndUpdate(
          {
            _id: req.user._id,
            "cart.id": mongoose.Types.ObjectId(req.query.productId)
          },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true } //Recieve back updated user
        )
          .then(doc => {
            res.status(200).json(doc.cart);
          })
          .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
      } else {
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                id: mongoose.Types.ObjectId(req.query.productId),
                quantity: 1,
                date: Date.now()
              }
            }
          },
          { new: true } //Recieve back updated user
        )
          .then(doc => {
            res.status(200).json(doc.cart);
          })
          .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
      }
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE /api/users/removeFromCart
router.get("/removeFromCart", auth, (req, res) => {
  let cart;
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: { id: mongoose.Types.ObjectId(req.query._id) } }
    },
    { new: true }
  )
    .then(doc => {
      cart = doc.cart;
      let array = cart.map(item => {
        return mongoose.Types.ObjectId(item.id);
      });

      return Product.find({ _id: { $in: array } })
        .populate("brand")
        .populate("wood")
        .lean() //Lets us modify
        .exec();
    })
    .then(cartDetail => {
      return res.status(200).json({
        cartDetail,
        cart
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

module.exports = router;
