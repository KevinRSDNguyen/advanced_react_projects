const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
// require("dotenv").config();
const { SECRET } = require("./../../config/keys");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: "email is required",
    trim: true,
    unique: true,
    lowercase: true,
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"]
  },
  password: {
    type: String,
    required: "password is required",
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"]
  },
  name: {
    type: String,
    required: "name is required",
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"]
  },
  lastname: {
    type: String,
    required: "lastname is required",
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"]
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  },
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Number
  }
});

userSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    //Prevent rehashing if user changes name/email, etc
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), SECRET);

  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  jwt.verify(token, SECRET, function(err, decode) {
    user
      .findOne({ _id: decode, token: token })
      .then(user => {
        return cb(null, user);
      })
      .catch(err => cb(err));
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
