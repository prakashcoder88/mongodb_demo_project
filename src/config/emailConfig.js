const nodemailer = require("nodemailer")
require("dotenv").config()
require("../models/user")

const {MAILTRAP_API_KEY, MAILTRAP_password, MAILTRAP_HOST, MAILTRAP_PORT} = process.env


let transport = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth:{
        user:MAILTRAP_API_KEY,
        pass:MAILTRAP_password
    }

})

module.exports = transport;