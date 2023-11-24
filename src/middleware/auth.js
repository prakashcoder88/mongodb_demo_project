const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");


const { JWT_SECRET_KEY } = process.env;

async function userVerifyJwtToken(req, res, next) {
  const token = req.headers["auth"];
  if (token == null) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    const exitsUser = await User.findOne({ _id: verified?._id });

    
  if (verified && exitsUser) {
      req.user = verified;
      next();
    }else{
        return res.status(401).send({
            success: false,
            message: "Invalid token",
        });
    }
  } catch (error) {
    return res.status(401).send({
        success: false,
        message: "Token Expired",
      });
  }
}

async function sellerVerifyJwtToken(req, res, next) {
  const token = req.headers["auth"];
  if (token == null) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    const exitsUser = await User.findOne({ _id: verified?._id });

    
    if (verified && exitsUser) {
      if (exitsUser.role === "seller") {
        req.user = verified;
        next();
      } else {
        res.status(403).json({
          status: StatusCodes.FORBIDDEN,
          message: "Access denied. You are not a seller.",
        });
      }
    }
  } catch (error) {
    return res.status(401).send({
        success: false,
        message: "Token Expired",
      });
  }
}


async function adminVerifyJwtToken(req, res, next) {
  const token = req.headers["auth"];
  if (token == null) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    const exitsUser = await User.findOne({ _id: verified?._id });


    if (verified && exitsUser) {
      if (exitsUser.role === 'admin') {

        req.user = verified;
        next();
      } else {
        res.status(403).json({
          status: StatusCodes.FORBIDDEN,
          message: "Access denied. You are not an admin.",
        });
      }
    }
  } catch (error) {
    return res.status(401).send({
        success: false,
        message: "Token Expired",
      });
  }
}





  



module.exports ={
    userVerifyJwtToken,
    sellerVerifyJwtToken,
    adminVerifyJwtToken
}
