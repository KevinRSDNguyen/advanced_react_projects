const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_I = 10;
// require("dotenv").config();

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

const User = mongoose.model("User", userSchema);

module.exports = { User };
