const bcrypt = require('bcrypt')
const Razorpay = require('razorpay')
const passwordEncrypt = async(password) =>{
    let salt = await bcrypt.genSalt(10)
    let passwordHash = bcrypt.hash(password,salt)
    return passwordHash
}

const passwordValidate = (password) =>{
    const pattern = /^[^\s]{6,16}$/;
    return pattern.test(password)
}

function referralCodeGenerate(){
    const CHARACTER_SET ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const CHARACTER_LENGTH = 8;
    let code = '';

    for(let i = 0; i < CHARACTER_LENGTH; i++){
        const randomcode = Math.floor(Math.random()* CHARACTER_SET.length);
        code += CHARACTER_SET[randomcode]
    }
    return code
}

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 90000).toString();
    return otp;
}

const otpExpireTime = ()=>{
    const expiry = Date.now() + 5 * 60 * 1000;
    const expiryIST = new Date(expiry).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
    return expiryIST;
}



module.exports = {
    passwordEncrypt,
    referralCodeGenerate,
    generateOTP,
    passwordValidate,
    otpExpireTime,
 
    
}