const nodemailer = require("nodemailer");
const transpoter = require("../config/emailConfig");
require("../models/user");



const SendEmail = async (email, otpCode)=>{
    const mailSend = { 
        to:email,
        from: process.env.MAILTRAP_USER_FROM,
        subject:'Password Reset OTP',
        text:'Your OTP for password reset is:${otpCode}',
        html:`<p>Your OTP for password reset is: <strong>${otpCode}</strong></p>`
    }
    let info = await transpoter.sendMail(mailSend);
    try {
        await sgMail.send(msg);
        console.log('Email Sent Successfully');
    } catch (error) {
        console.error('Error Sending email:', error);
    }
}