const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      required: "name is required",
      type: String,
      unique: 1,
      max: [100, "Too long, max is 100 characters"],
      lowercase: true
    },
    description: {
      required: "description is required",
      type: String,
      max: [100000, "Too long, max is 100000 characters"]
    },
    price: {
      required: "price is required",
      type: Number,
      maxlength: 255
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: "brand is required"
    },
    shipping: {
      required: "shipping is required",
      type: Boolean
    },
    available: {
      required: "available is required",
      type: Boolean
    },
    wood: {
      type: Schema.Types.ObjectId,
      ref: "Wood",
      required: "wood is required"
    },
    frets: {
      required: "frets is required",
      type: Number
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0
    },
    publish: {
      required: "publish is required",
      type: Boolean
    },
    images: {
      type: Array,
      default: []
    }
  },
  { timestamps: true } //Tells us when things were updated
);

const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
