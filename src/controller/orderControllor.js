const { StatusCodes } = require("http-status-codes");
// const razorpay = require("../utils/razorpay");
const responseMeassage = require("../utils/responseMeassage.js");
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");

exports.orderCreate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartId, status } = req.body;

    const cartData = await Cart.findOne({
      _id: cartId,
      userId: userId,
    });

    if (!cartData) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMeassage.PRODUCT_NOT_IN_CART,
      });
    }

    for (const product of cartData.products) {
      const productId = product.productId;
      const quantity = product.quantity;

      const productData = await Product.findById(productId);

      if (!productData) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responseMeassage.PRODUCT_NOT_FOUND,
        });
      }

      if (productData.stock < quantity) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responseMeassage.OUTOFF_STOCK,
        });
      }
      productData.stock -= quantity;
      await productData.save();
    }

    let orderData = new Order({
      userId,
      products: cartData.products,
      totalamount: cartData.totalamount,
      status: status,
    });

    await orderData.save();
    await Cart.findByIdAndDelete(cartId);

    return res.status(201).json({
      status: StatusCodes.CREATED,
      message: responseMeassage.ORDER_CREATED,
      data: orderData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const orderQuantity = req.body.quantity || 1;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.PRODUCT_NOT_FOUND,
      });
    } else if (product.stock < orderQuantity) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.INSUFFICIENT_PRODUCT_QUANTITY,
      });
    } else {
      const newOrder = new Order({
        userId: userId,
        products: [
          {
            productId: product._id,
            quantity: orderQuantity,
          },
        ],
        totalamount: product.price * orderQuantity,
      });

      const order = await newOrder.save();
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -orderQuantity },
      });
      return res.status(200).json({
        status: StatusCodes.OK,
        message: responseMeassage.ORDER_PLACED,
        data: order,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
};

// exports.renderProductPage = async (req, res) => {
//   try {
//         const cartId = await Cart.find();
//     console.log(cartId);

//     res.render("product",{cartId:cartId});//
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.orderCreate = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const cartId = req.body.cart_id;
//     const { status } = req.body;
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

//     const options = {
//       amount: cartData.totalamount * 100,
//       currency: "INR",
//       receipt: "Receipt-" + Date.now(),
//     };

//     let orderData = new Order({
//       userId,
//       products: cartData.products,
//       amount: cartData.totalamount,
//       currency: "INR",
//       receipt: options.receipt,
//       status: status,
//     });

//     const order = razorpay.orders.create(options,
//       (err, order)=>{
//         if(!err){
//             res.status(200).send({
//                 success:true,
//                 msg:'Order Created',
//                 order_id:order.id,
//                 amount:amount,
//                 key_id:RAZORPAY_ID_KEY,
//                 // product_name:req.body.name,
//                 // description:req.body.description,
//                 contact:"9898987887",
//                         name: "prakash",
//                         email: "prakashpatel.vhits@gmail.com"
//             });
//         }
//         else{
//             res.status(400).send({success:false,msg:'Something went wrong!'});
//         }
//     });
// console.log(order);
//     await orderData.save();
//     await Cart.findByIdAndDelete(cartId);

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: {
//         orderId: order.id,
//         amount: order.amount,
//         currency: order.currency,
//         userId,
//         products: cartData.products,
//         totalamount: cartData.totalamount,
//         currency: "INR",
//         receipt: options.receipt,
//         status: status,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: responseMeassage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };
