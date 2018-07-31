const mongoose = require("mongoose");

const woodSchema = mongoose.Schema({
  name: {
    required: "name is required",
    type: String,
    unique: 1,
    max: [100, "Too long, max is 100 characters"],
    lowercase: true
  }
});

const Wood = mongoose.model("Wood", woodSchema);

module.exports = { Wood };
