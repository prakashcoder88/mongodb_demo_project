const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
  passwordEncrypt,
  passwordValidate,
  referralCodeGenerate,
  generateOTP,
  otpExpireTime,
} = require("../services/commonServices");
const responseMeassage = require("../utils/responseMeassage.json");
const { generateToken } = require("../utils/jwt");

async function renderLogin (req,res){

  try {
      res.render('login');

  } catch (error) {
      console.log(error.message);
  }

}


async function addUser(req, res) {
  try {
    const { name, email, password, phone, address,role, referral } = req.body;

    const username =
      name.replace(/\s/g, "").toLowerCase() +
      Math.floor(Math.random().toFixed(2) * 100);

    let referralcode = referralCodeGenerate();

    if (!name && !email && !phone && !password && !referral) {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        meassage: responseMeassage.Required,
      });
    } else if (!passwordValidate(password)) {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        meassage: responseMeassage.passwordvalidate,
      });
    } else {
      const existingUser = await User.findOne({ email });
      const existingPhone = await User.findOne({ phone });

      if (existingUser && existingPhone) {
        const meassage = existingUser
          ? responseMeassage.existinguser
          : responseMeassage.existingphone;

        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          meassage,
        });
      } else {
        const referralUser = await User.findOne({ referralcode: referral });
        if (!referralUser) {
          res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            meassage: responseMeassage.referral,
          });
        }
       
        let passwordHash = await passwordEncrypt(password);

        const userData = new User({
          name,
          username,
          email,
          password: passwordHash,
          phone,
          address: {
            address_Line_1: address.address_Line_1,
            City: address.City,
            State: address.State,
            PostalCode: address.PostalCode,
            Country: address.Country,
          },
          referralcode: referralcode,
          referral,
          referralBy: referralUser._id,
          profileimage: req.fileurl,
          rewards: 0,
          role,
        });

        userData
          .save()
          .then(async (data) => {
            referralUser.rewards += 1;
            await referralUser.save();

            res.status(201).json({
              status: StatusCodes.CREATED,
              meassage: responseMeassage.created,
              data: data,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              meassage: responseMeassage.not_created,
              err: err,
            });
          });
      
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
}

async function loginUser(req, res) {
  try {
    let { masterfield, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: masterfield },
        { email: masterfield },
        { phone: masterfield },
      ],
    });

    if (!user) {
      res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: responseMeassage.Not_authorized,
      });
    } else if (user.isActivated) {
      res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        meassage: responseMeassage.Not_authorized,
      });
    } else {
      const isvalid = await bcrypt.compare(password, user.password);

      if (!isvalid) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: responseMeassage.notmatch,
        });
      } else {
        const { error, token } = await generateToken({ _id: user._id });

        if (error) {
          res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMeassage.notcreatetoken,
          });
        } else {
          return res.status(200).json({
            status: StatusCodes.OK,
            success: true,
            message: responseMeassage.success,
            accesstoken: token,
          });
        }
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: responseMeassage.notsuccess,
    });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user;

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ _id: userId });
    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMeassage.passwordnotmatch,
      });
    }
    const checkNewPassword = await bcrypt.compare(newPassword, user.password);
    if (checkNewPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMeassage.newpasswordnotmatch,
      });
    }
    const passwordHash = await passwordEncrypt(newPassword, user.password);

    const updatePassword = await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: passwordHash } },
      { new: true }
    )
      .then((updatePassword) => {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: responseMeassage.passwordupdate,
          data: updatePassword,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responseMeassage.notupdatepassword,
          err: err,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Enter your email id",
      });
    } else {
      const checkEmail = await User.findOne({ email });
      if (!checkEmail) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responseMeassage.not_found,
        });
      }
      const otpExpire = new Date();

      const otpCode = generateOTP();
      const otp = await User.findByIdAndUpdate(
        { _id: checkEmail._id },
        { $set: { otp: otpCode, otpExpire: otpExpire } },
        { new: true }
      );
      // await forgotPasswordSendEmail(email, otpCode);
      return res.status(200).json({
        status: StatusCodes.OK,
        message: "Otp Send Successfully in your email",
        // otp: otp,
        otp: otpCode,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error,
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const otpData = await User.findOne({ email, otp });

    if (otpData) {
      const otpTimestamp = new Date(otpData.otpExpire);
      const otpExpirationTime = new Date(
        otpTimestamp.getTime() + 2 * 60 * 1000
      );
      const currentTime = new Date();

      if (currentTime <= otpExpirationTime) {
        res
          .status(200)
          .json({ status: StatusCodes.OK, message: responseMeassage.verify });
      } else {
        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          error: responseMeassage.otpexpired,
        });
      }
    } else {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        error: responseMeassage.otpinvalid,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: responseMeassage.Required,
      });
    } else if (!passwordValidate(newPassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMeassage.passwordvalidate,
      });
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responseMeassage.not_found,
        });
      } else {
        if (newPassword !== confirmPassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMeassage.notmatch,
          });
        } else if (user.otpExpire < new Date()) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMeassage.session_time_out,
          });
        } else {
          const passwordHash = await passwordEncrypt(newPassword);
          const updateUser = await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { otp: null, password: passwordHash, otpExpire: null } },
            { new: true }
          );

          return res.status(200).json({
            status: StatusCodes.OK,
            message: responseMeassage.passwordupdate,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMeassage.internal_server_error,
    });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user;
    const { email, phone } = req.body;

    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingUser || existingPhone) {
      const message = existingUser
        ? responseMeassage.existinguser
        : responseMeassage.existingphone;

      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.not_found,
      });
    }

    const updatedUserData = {
      email,
      phone,
    };

    const result = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUserData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User Data Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
}

async function uploadImage(req, res) {
  try {
    const userId = req.user;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMeassage.not_found,
      });
    } else {
      const profileImageUrl = user.profileimage;

      if (profileImageUrl) {
        fs.unlink(`./public/uploads/${profileImageUrl}`, (err) => {
          if (err) {
            console.log("Error while deleting old image:");
          } else {
            console.log("Old image deleted successfully:", profileImageUrl);
          }
        });
      }
    }

    const updatedUserData = {
      profileimage: req.fileurl,
    };

    const result = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUserData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User Data Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
}




module.exports = {
  addUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateUser,
  uploadImage,
  renderLogin
};
