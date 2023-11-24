const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: false,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          require: false,
        },
        price: {
          type: Number,
          require: false,
        },
      },
    ],
    totalamount: {
      type: Number,
      require: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Cart = new mongoose.model("cart", cartSchema);
module.exports = Cart;
