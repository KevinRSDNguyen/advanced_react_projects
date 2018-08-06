const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  user: {
    type: Array,
    default: []
  },
  data: {
    //payment data
    type: Array,
    default: []
  },
  product: {
    //data on product sold
    type: Array,
    default: []
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };
