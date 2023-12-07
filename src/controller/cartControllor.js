const { StatusCodes } = require("http-status-codes");
const responseMeassage = require("../utils/responseMeassage.json");
const Product = require("../models/product");
const Cart = require("../models/cart");

async function addCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.PRODUCTNOTFOUND,
      });
    }
    if (product.stock < quantity) {
   
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Product stock not available to given quantity",
      });
    }
    const cartList = await Cart.findOne({ userId });

    if (cartList) {
      let existingProduct = cartList.products.findIndex(
        (p) => p.productId == productId
      );

      if (existingProduct > -1) {
        cartList.products[existingProduct].quantity += quantity;
        cartList.products[existingProduct].price += product.price * quantity;
      } else {
        cartList.products.push({
          productId,
          quantity,
          price: product.price * quantity,
        });
      }

      cartList.totalamount = cartList.products.reduce(
        (total, product) => total + product.price,
        0
      );

      await cartList.save();

      return res.status(201).send({
        status: StatusCodes.CREATED,
        message: responseMeassage.PRODUCTADDCART,
        data: cartList,
      });
    } else {
      const newCartList = await Cart.create({
        userId,
        products: [{ productId, quantity, price: product.price * quantity }],
        totalamount: product.price * quantity,
      });

      return res.status(201).send({
        status: StatusCodes.CREATED,
        message: responseMeassage.PRODUCTADDCART,
        data: newCartList,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}

async function userCartList(req, res) {
  try {
    const userId = req.user._id;

    const AllCartList = await Cart.find({})
      .populate("products.productId")
      .populate("userId", "name email address phone");

    return res.status(200).send({
      success: StatusCodes.OK,
      message: "Get cart details Successfully",
      data: AllCartList,
    });
  } catch (error) {
    return res.status(500).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}

async function productQuantityUpdate(req, res) {
  try {
    const userId = req.user._id;
    const { productId, action } = req.body;

    const cartList = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!cartList) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.PRODUCTNOTFOUND,
      });
    }

    const existingProduct = cartList.products.find(
      (p) => p.productId == productId
    );

    if (existingProduct) {
      if (action === "increment") {
        existingProduct.quantity += 1;
      } else if (action === "decrement") {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          cartList.products = cartList.products.filter(
            (p) => p.productId != productId
          );
        }
      }

      existingProduct.price = existingProduct.quantity * product.price;

      cartList.totalamount = cartList.products.reduce(
        (total, product) => total  + product.price,
        0
      );

      await cartList.save();

      return res.status(200).send({
        status: StatusCodes.OK,
        message: responseMeassage.PRODUCTADDCART,
        data: cartList,
      });
    } else {
      return res.status(404).send({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.PRODUCTNOTFOUND,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}



module.exports = {
  addCart,
  userCartList,
  productQuantityUpdate,
};
