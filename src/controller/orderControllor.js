const { StatusCodes } = require("http-status-codes");
const razorpay = require("../utils/razorpay");
const responseMeassage = require("../utils/responseMeassage.json");
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");

// const orderCreate = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { cartId, status } = req.body;

//     const cartData = await Cart.findOne({
//       _id: cartId,
//       userId: userId,
//     });

//     if (!cartData) {
//       return res.status(400).json({
//         success: false,
//         message: "No items in cart",
//       });
//     }

//     for (const product of cartData.products) {
//       const productId = product.productId;
//       const quantity = product.quantity;

//       const productData = await Product.findById(productId);

//       if (!productData) {

//         return res.status(400).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       if (productData.stock < quantity) {
//         return res.status(400).json({
//           success: false,
//           message: "Out of stock",
//         });
//       }
//       productData.stock -= quantity;
//       await productData.save();
//     }

//     let orderData = new Order({
//       userId,
//       products: cartData.products,
//       totalamount: cartData.totalamount,
//       status: status,
//     });

//     await orderData.save();
//     await Cart.findByIdAndDelete(cartId);

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: orderData,
//     });
//   } catch (error) {

//     console.log(error);
//     return res.status(500).send({
//      status:StatusCodes.INTERNAL_SERVER_ERROR,
//       message: responseMeassage.INTERNAL_SERVER_ERROR,

//     });
//   }
// };

const renderProductPage = async (req, res) => {
  try {
//     const cartId = await Cart.findOne(_id);
// console.log(cartId);

    res.render("product");
  } catch (error) {
    console.log(error);
  }
};

const orderCreate = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartId = req.body.cart_id;

    const { status } = req.body;

    const cartData = await Cart.findOne({
      _id: cartId,
      userId: userId,
    });

    if (!cartData) {
      return res.status(400).json({
        success: false,
        message: "No items in cart",
      });
    }

    for (const product of cartData.products) {
      const productId = product.productId;
      const quantity = product.quantity;

      const productData = await Product.findById(productId);

      if (!productData) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      if (productData.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Out of stock",
        });
      }
      productData.stock -= quantity;
      await productData.save();
    }

    const options = {
      amount: cartData.totalamount * 100,
      currency: "INR",
      receipt: "Receipt-" + Date.now(),
    };

    let orderData = new Order({
      userId,
      products: cartData.products,
      totalamount: cartData.totalamount,
      currency: "INR",
      receipt: options.receipt,
      status: status,
    });

    const order = await razorpay.orders.create(options);

    await orderData.save();
    await Cart.findByIdAndDelete(cartId);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        userId,
        products: cartData.products,
        totalamount: cartData.totalamount,
        currency: "INR",
        receipt: options.receipt,
        status: status,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  orderCreate,
  renderProductPage,
};
