const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalamount:{
    type:Number,
    required:false

  },
  currency:{
    type:String,
    required:false
  },
  receipt:{
    type:String,
    required:false
  },
  status: { type: String, default: "Pending" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
