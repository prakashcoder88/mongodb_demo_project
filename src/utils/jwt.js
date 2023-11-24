const jwt = require("jsonwebtoken");
require("dotenv").config();
require("../models/user")
require("../controller/userController")
const { JWT_SECRET_KEY } = process.env;

const options = {
  expiresIn: "24h",
};

async function generateToken({ _id }) {

  try {
    const payload = { _id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, options);
    return { error: false, token };
  } catch (error) {
    return { error: true };
  }
}
module.exports = {
  generateToken,
};
