const fs = require('fs')
const { StatusCodes } = require("http-status-codes");
const responseMeassage = require("../utils/responseMeassage.json");
const Favorite = require("../models/favorite");
const Product = require("../models/product");
const User = require("../models/user");


async function addProduct(req, res) {
  try {
    const {
      productcode,
      brand,
      description,
      seller,
      size,
      style,
      category,
      material_type,
      date,
      price,
      reviews,
    } = req.body;
    const existingProdcutcode = await Product.findOne({ productcode });

    if (existingProdcutcode) {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMeassage.PRODUCTEXIST,
      });
    } else {
      const productData = new Product({
        productcode,
        brand,
        description,
        category,
        date,
        price,
        seller,
        style,
        size,
        material_type,
        reviews,
      });

      productData
        .save()
        .then((data) => {
          res.status(201).json({
            status: StatusCodes.CREATED,
            message: responseMeassage.PRODUCTADD,
            data: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMeassage.PRODUCTNOTADD,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}
async function productStatusChange(req, res) {
  try {
    const productId = req.params.id;
    const { status } = req.body;

  Product.findOneAndUpdate(
      { _id: productId },
      { $set: { status } },
      { new: true }
    ).then((result)=>{

      res.status(200).json({
        status: StatusCodes.OK,
        message: "Status update successfully",
        data: result,
      });
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}
async function likeDislikeProduct(req, res) {
  try {
    const userId = req.user._id;
    const { productId, isLike } = req.body;
    Favorite.findOneAndUpdate(
      { userId, productId },
      { isLike },
      { new: true, upsert: true }
    )
      .then((data) => {
        const message = isLike
          ? responseMeassage.LIKED
          : responseMeassage.DISLIKED;
        res.status(200).json({
          status: StatusCodes.OK,
          message,
          data: data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "Please try agin",
        });
      });
  } catch (error) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}
async function allProduct(req, res) {
  try {
    const userId = req.user._id;

    const AllProducts = await Product.find({
      isDelete: false,
    });


    const productData = await Promise.all(
      AllProducts.map(async (product) => {
        const likeProduct = await Favorite.findOne({
          userId,
          productId: product._id,
        });

      const likeStatus = {
        ...product.toObject(),
        isLike: likeProduct ? true : false,
      };

      return likeStatus;
    })
    )

    res.status(200).send({
      status: StatusCodes.OK,
      message: "Get all data successfully",
      data: productData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}
async function favoriteProduct(req, res) {
  try {
    const userId = req.user._id;

    const favoriteProduct = await Favorite.find({
      userId: userId,
      isLike: true,
    })

      .populate("userId", "name email")
      .populate("productId");

    return res.status(200).send({
      status: StatusCodes.OK,
      message: "Get liked products details",
      data: favoriteProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}

async function searchProduct(req, res) {
  const search = req.query.q;

  if (!search) {
    return res.status(400).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Search details are required",
    });
  }

  try {
    const regex = new RegExp(search, "i");

    const results = await Product.find({
      $or: [
        { productcode: regex },
        { category: regex },
        { brand: regex },
        { material_type: regex },
        { seller: regex },
        { size: regex },
        { style: regex },
        { price: regex },
        { date: regex },
        { reviews: regex },
        { description: regex },
      ],
    });
    res.status(200).json({
      status:StatusCodes.OK,
      message:"Search details find successfully",
      data:results });
  } catch (error) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}

async function demoaggregate(req, res) {
  try {
    const userId = req.user._id;

    const productLikeStatus = await Product.aggregate([
      {
        $match: {
          isDelete: false,
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "Favorite",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$productId", "$$productId"] },
                  ],
                },
              },
            },
          ],
          as: "likeProduct",
        },
      },
      {
        $addFields: {
          isLike: {
            $gt: [{ $size: "$likeProduct" }, 0],
          },
        },
      },
      {
        $project: {
          likeProduct: 0,
        },
      },
    ]);

    return res.status(200).json({
      status: StatusCodes.OK,
      message: "Get data successfully",
      data: productLikeStatus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
    });
  }
}

async function uploadImage(req, res) {
  try {

    const productId = req.params.id;

    const product = await Product.findOne({_id:productId})
   
    if (!product) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.not_found,
      });
    } 
    else {
      const productImageUrl = product.productimage;

      if (productImageUrl) {
        fs.unlink(`./public/uploads/${productImageUrl}`, (err) => {
          if (err) {
            console.log("Error while deleting old image:");
          } else {
            console.log("Old image deleted successfully:", productImageUrl);
          }
        });
      }
    }

    const updatedProductData = {
      productimage: req.fileurl,
    };

    const result = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedProductData },
      { new: true }
    );

    return res.status(200).json({
      status:StatusCodes.OK,
      message: "Product image upload successfully",
      data: result,
    });
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status:StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.INTERNAL_SERVER_ERROR,
     
    });
  }
}


module.exports = {
  addProduct,
  productStatusChange,
  likeDislikeProduct,
  allProduct,
  favoriteProduct,
  searchProduct,
  demoaggregate,
  uploadImage
};
