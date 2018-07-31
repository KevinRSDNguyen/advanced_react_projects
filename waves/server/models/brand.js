const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    required: "name is required",
    type: String,
    unique: 1,
    max: [100, "Too long, max is 100 characters"],
    lowercase: true
  }
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = { Brand };
