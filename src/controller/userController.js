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
} = require("../services/CommonServices");
const responseMessage = require("../utils/responseMeassage.js");
const { generateToken } = require("../utils/jwt");

// async function renderLogin(req, res) {
//   try {
//     res.render("login");
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// exports.addUpdateUser = async(req, res) => {
//   try {
//     // const userId = req.user;
//     const { userId } = req;
//     const { name, email, password, phone, address, role, referral } = req.body;

//     // Check if it's an update or create operation
//     const isUpdate = userId && (email || phone);

//     // If it's an update, handle it
//     if (isUpdate) {
//       const existingUser = await User.findOne({
//         $and: [{ _id: userId }, { $or: [{ email }, { phone }] }],
//       });

//       if (existingUser) {
//         const message =
//           existingUser.email === email
//             ? responseMessage.existinguser
//             : responseMessage.existingphone;

//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message,
//         });
//       }

//       const user = await User.findOne({ _id: userId });

//       if (!user) {
//         return res.status(404).json({
//           status: StatusCodes.NOT_FOUND,
//           message: responseMessage.not_found,
//         });
//       }

//       const updatedUserData = {
//         email,
//         phone,
//       };

//       const result = await User.findByIdAndUpdate(
//         userId,
//         { $set: updatedUserData },
//         { new: true }
//       );

//       return res.status(200).json({
//         status: StatusCodes.OK,
//         message: "User Data Updated Successfully",
//         data: result,
//       });
//     } else {
//       // If it's a create operation, handle it
//       const username =
//         name.replace(/\s/g, "").toLowerCase() +
//         Math.floor(Math.random().toFixed(2) * 100);

//       let referralcode = referralCodeGenerate();

//       if (!name || !email || !phone || !password || !referral) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: responseMessage.Required,
//         });
//       } else if (!passwordValidate(password)) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: responseMessage.passwordvalidate,
//         });
//       } else {
//         const existingUser = await User.findOne({ email });
//         const existingPhone = await User.findOne({ phone });

//         if (existingUser && existingPhone) {
//           const message = existingUser
//             ? responseMessage.existinguser
//             : responseMessage.existingphone;

//           return res.status(400).json({
//             status: StatusCodes.BAD_REQUEST,
//             message,
//           });
//         } else {
//           const referralUser = await User.findOne({ referralcode: referral });
//           if (!referralUser) {
//             return res.status(400).json({
//               status: StatusCodes.BAD_REQUEST,
//               message: responseMessage.referral,
//             });
//           }

//           let passwordHash = await passwordEncrypt(password);

//           const userData = new User({
//             name,
//             username,
//             email,
//             password: passwordHash,
//             phone,
//             address: {
//               address_Line_1: address.address_Line_1,
//               City: address.City,
//               State: address.State,
//               PostalCode: address.PostalCode,
//               Country: address.Country,
//             },
//             referralcode: referralcode,
//             referral,
//             referralBy: referralUser._id,
//             profileimage: req.fileurl,
//             rewards: 0,
//             role,
//           });

//           userData
//             .save()
//             .then(async (data) => {
//               referralUser.rewards += 1;
//               await referralUser.save();

//               res.status(201).json({
//                 status: StatusCodes.CREATED,
//                 message: responseMessage.created,
//                 data: data,
//               });
//             })
//             .catch((err) => {
//               res.status(500).json({
//                 status: StatusCodes.INTERNAL_SERVER_ERROR,
//                 message: responseMessage.not_created,
//                 err: err,
//               });
//             });
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: "Internal Server Error",
//     });
//   }
// }

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, referral } = req.body;

    const username =
      name.replace(/\s/g, "").toLowerCase() +
      Math.floor(Math.random().toFixed(2) * 100);

    let referralcode = referralCodeGenerate();

    if (!name && !email && !phone && !password && !referral) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMessage.REQUIRED,
      });
    } else if (!passwordValidate(password)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMessage.PASSWORD_VALIDATE,
      });
    } else {
      const existingUser = await User.findOne({ email });
      const existingPhone = await User.findOne({ phone });

      if (existingUser && existingPhone) {
        const message = existingUser
          ? responseMessage.EXUSTING_USER
          : responseMessage.EXISTING_PHONE;

          return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message,
        });
      } else {
        const referralUser = await User.findOne({ referralcode: referral });
        if (!referralUser) {
          return  res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMessage.REFERRAL,
          });
        }

        let passwordHash = await passwordEncrypt(password);

        const userData = new User.create({
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

        referralUser.rewards += 1;
        await referralUser.save();

        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: responseMessage.CREATED,
          data: data,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let {masterfield, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: masterfield },
        { email: masterfield },
        { phone: masterfield },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMessage.NOTFOUND,
      });
    } else if (user.isActivated) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        meassage: responseMessage.NOT_AUTHORIZED,
      });
    } else {
      const isvalid = await bcrypt.compare(password, user.password);

      if (!isvalid) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: responseMessage.NOT_MATCH,
        });
      } else {
        const { error, token } = await generateToken({ _id: user._id });

        if (error) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMessage.NOT_CREATE_TOKEN,
          });
        } else {
          return res.status(200).json({
            status: StatusCodes.OK,
            success: true,
            message: responseMessage.SUCCESS,
            accesstoken: token,
          });
        }
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: responseMessage.NOT_SUCCESS,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user;

    const getUser = await User.findOne({ _id: userId });

    if (!getUser) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMessage.NOTFOUND,
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: responseMessage.DETAILS_FOUND,
        data: getUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user;

    const getUsers = await User.find({});

    if (!getUsers) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMessage.NOTFOUND,
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: responseMessage.DETAILS_FOUND,
        data: getUsers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user;

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ _id: userId });
    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMessage.OLD_PASSWORD_NOT_MATCH,
      });
    }
    const checkNewPassword = await bcrypt.compare(newPassword, user.password);
    if (checkNewPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMessage.NEW_PASSWORD_MATCH,
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
          message: responseMessage.PASSWORD_UPDATE,
          data: updatePassword,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responseMessage.NOT_UPDATE_PASSWORD,
          err: err,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
      error: error,
    });
  }
};

exports.forgotPassword = async (req, res) => {
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
          message: responseMessage.NOTFOUND,
        });
      }
      //const otpExpires = otpExpireTime;
      const otpExpire = new Date();

      const otpCode = generateOTP();
      const otp = await User.findByIdAndUpdate(
        { _id: checkEmail._id },
        { $set: { otp: otpCode, otpExpire: otpExpire } },
        { new: true }
      );
      await SendEmail(email, otpCode);

      return res.status(200).json({
        status: StatusCodes.OK,
        message: responseMessage.SEND_OTP,
        // otp: otp,
        otp: otpCode,
      });
    }
  } catch (error) {
    return res.status(500).json({
     status:StatusCodes.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      
    });
  }
};

exports.verifyOtp = async (req, res) => {
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
          .json({ status: StatusCodes.OK, message: responseMessage.VERIFY });
      } else {
        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          error: responseMessage.OTPEXPIRED,
        });
      }
    } else {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        error: responseMessage.OTPINVALID,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:responseMessage.INTERNAL_SERVER_ERROR,
     
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: responseMessage.REQUIRED,
      });
    } else if (!passwordValidate(newPassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responseMessage.PASSWORD_VALIDATE,
      });
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responseMessage.NOTFOUND,
        });
      } else {
        if (newPassword !== confirmPassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMessage.NOT_MATCH,
          });
        } else if (user.otpExpire < new Date()) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responseMessage.SESSION_TIME_OUT,
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
            message: responseMessage.PASSWORD_UPDATE,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user;
    const { email, phone } = req.body;

    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingUser || existingPhone) {
      const message = existingUser
        ? responseMessage.EXUSTING_USER
        : responseMessage.EXISTING_PHONE;

      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMessage.NOTFOUND,
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
      status: StatusCodes.OK,
      message: responseMessage.UPDATE_DETAILS,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
     status:StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,
 
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: responseMessage.NOTFOUND,
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
      status: StatusCodes.OK,
      message: responseMessage.UPDATE_DETAILS,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status:StatusCodes.INTERNAL_SERVER_ERROR,
      message: responseMessage.INTERNAL_SERVER_ERROR,

    });
  }
};
exports.logout = async (req, res) => {
  try {
    const token = req.headers.auth;

    return res.status(200).json({
      status: StatusCodes.OK,
      message: responseMessage.LOGOUT,
    });
  } catch (error) {
    console.log(error);
  }
};
