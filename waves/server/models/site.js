const mongoose = require("mongoose");

const siteSchema = mongoose.Schema({
  name: {
    type: String
  },
  featured: {
    //For home page
    required: true,
    type: Array,
    default: []
  },
  siteInfo: {
    required: true,
    type: Array,
    default: []
  }
});

const Site = mongoose.model("Site", siteSchema);

module.exports = { Site };
