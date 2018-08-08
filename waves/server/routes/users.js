const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const formidable = require("express-formidable"); //Help us get files on req
const cloudinary = require("cloudinary");
const SHA1 = require("crypto-js/sha1");
const { User } = require("./../models/user");
const { Product } = require("./../models/product");
const { Payment } = require("./../models/payment");
const { auth } = require("./../middleware/auth");
const { admin } = require("./../middleware/admin");
const { sendEmail } = require("./../utils/mail/index");
const { normalizeErrors, checkFileType } = require("./../helpers/index");
const multer = require("multer");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET
} = require("./../../config/keys");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET
});

//Multer Config
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); //originalname from multer
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, //file size limit of 10mb
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("file");

//Route /api/users/uploadfile
// Save image in local
router.post("/uploadfile", auth, admin, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(422).json({ errors: [{ detail: err }] });
    }
    return res.json({ success: true });
  });
});

//Route /api/users/admin_files
router.get("/admin_files", auth, admin, (req, res) => {
  const dir = path.resolve(".") + "/uploads/";
  fs.readdir(dir, (err, items) => {
    if (err) {
      return res.status(422).json({ errors: [{ detail: err }] });
    }
    //Returns array with name of files as strings
    return res.status(200).send(items);
  });
});

//Route /api/users/download/funny12345.jpg
router.get("/download/:id", auth, admin, (req, res) => {
  const file = path.resolve(".") + `/uploads/${req.params.id}`;
  res.download(file);
});

// ROUTE /api/users/uploadimage
//Upload image thru cloudinary
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

// ROUTE /api/users/reset_user
// Generate reset token on User model and email it to user
router.post("/reset_user", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      user.generateResetToken((err, user) => {
        if (err) return res.json({ success: false, err });
        sendEmail(user.email, user.name, "reset_password", user);
        return res.json({ success: true });
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE /api/users/reset_password
router.post("/reset_password", (req, res) => {
  const now = moment().valueOf();

  User.findOne({
    resetToken: req.body.resetToken,
    resetTokenExp: {
      $gte: now
    }
  })
    .then(user => {
      if (!user) {
        return res.status(422).json({
          errors: [
            {
              detail:
                "Sorry, looks like the reset link does not work. Please go to the Forgot Password Page again"
            }
          ]
        });
      }
      user.password = req.body.password;
      user.resetToken = "";
      user.resetTokenExp = "";
      return user.save();
    })
    .then(() => {
      return res.status(200).json({
        success: true
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
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
      sendEmail(userdata.email, userdata.name, "welcome");
      return res.json({
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

// ROUTE /api/users/successBuy
router.post("/successBuy", auth, (req, res) => {
  let updatedUser;
  let history = [];
  let transactionData = {}; //Becomes payment Model
  const date = new Date();
  //Create our own Purchase Number instead of exclusively using Paypals.
  const po = `PO-${date.getSeconds()}${date.getMilliseconds()}-${SHA1(
    req.user._id
  )
    .toString()
    .substring(0, 8)}`;

  // user history
  //We dont need description and wood of item purchased.
  req.body.cartDetail.forEach(item => {
    history.push({
      porder: po,
      dateOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID
    });
  });

  // PAYMENTS DASH
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email
  };
  transactionData.data = {
    ...req.body.paymentData,
    porder: po
  };
  transactionData.product = history;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true }
  )
    .then(user => {
      updatedUser = user;
      const payment = new Payment(transactionData);
      return payment.save();
    })
    .then(doc => {
      let promisesArr = [];
      doc.product.forEach(item => {
        promisesArr.push(
          Product.update(
            { _id: item.id },
            {
              $inc: {
                sold: item.quantity
              }
            },
            { new: false }
          )
        );
      });
      return Promise.all(promisesArr);
    })
    .then(promArr => {
      sendEmail(req.user.email, req.user.name, "purchase", transactionData);
      res.status(200).json({
        success: true,
        cart: updatedUser.cart,
        cartDetail: []
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

// ROUTE /api/users/update_profile
router.post("/update_profile", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: req.body
    },
    { new: true }
  )
    .then(doc => {
      res.send(doc);
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

module.exports = router;
