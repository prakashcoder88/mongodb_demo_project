const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productcode: {
      type: String,
      require: false,
    },
    category: {
      type: String,
      require: false,
    },
    brand: {
      type: String,
      require: false,
    },
    material_type: {
      type: String,
      require: false,
    },
    seller: {
      type: String,
      require: false,
    },
    size: {
      type: String,
      require: false,
    },
    style: {
      type: String,
      require: false,
    },

    price: {
      type: String,
      require: false,
    },
    date: {
      type: String,
      require: false,
    },
    reviews: {
      type: String,
      require: false,
    },
    description: {
      type: String,
      require: false,
    },
    productimage:{
      type:Array,
      require:false
    },
    stock: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Approved"],
      default: "Pending",
      require: false,
    },
    isDelete: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
