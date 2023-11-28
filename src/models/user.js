const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
    },
    username: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
    phone: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: false,
    },
    address: {
      address_Line_1: {
        type: String,
        required: false,
      },
      City: {
        type: String,
        required: false,
      },
      State: {
        type: String,
        required: false,
      },
      PostalCode: {
        type: String,
        required: false,
      },
      Country: {
        type: String,
        required: false,
      },
    },
    referralcode: {
      type: String,
      require: false,
    },
    referral: {
      type: String,
      require: false,
    },
    referralBy: {
      type: String,
      require: false,
    },
    rewards: {
      type: Number,
      require: false,
    },
    isActivated: {
      type: Boolean,
      default:false,
      require: false,
    },
    otp: {
      type: String,
      require: false,
    },
    otpExpire: {
      type: String,
      require: false,
    },
    profileimage: {
      type: String,
      require: false,
    },
    document: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      require: false,
      enum:['user','seller','admin'],
      default:"user"
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = new mongoose.model('user', userSchema)
module.exports = User
