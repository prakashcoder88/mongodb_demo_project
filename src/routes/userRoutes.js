const  express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const {userSchema} = require('../services/userValidation');
const {userVerifyJwtToken,adminVerifyJwtToken} = require('../middleware/auth')
const upload = require("../middleware/fileUpload")


router.post('/user/register', userController.addUser)
router.get('/user/renderLogin', userController.renderLogin)
router.post('/user/login', userController.loginUser)
router.get('/user/getuser', userVerifyJwtToken,userController.getUserDetails)

router.patch('/user/changepassword', userVerifyJwtToken,userController.changePassword)
router.post('/user/forgotpassword', userController.forgotPassword)
router.post('/user/verifyotp', userController.verifyOtp)
router.patch('/user/resetpassword', userController.resetPassword)
router.patch('/user/updateuser', userVerifyJwtToken,upload,userController.updateUser)
router.post('/user/profilepic', userVerifyJwtToken,upload,userController.uploadImage)



module.exports = router