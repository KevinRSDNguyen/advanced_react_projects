const express = require("express");
const router = express.Router();
const formidable = require("express-formidable"); //Help us get files on req
const cloudinary = require("cloudinary");
const { User } = require("./../models/user");
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

module.exports = router;
