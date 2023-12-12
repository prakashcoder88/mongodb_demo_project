const  express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const {userSchema} = require('../services/UserValidation');
const {userVerifyJwtToken,adminVerifyJwtToken} = require('../middleware/auth')
const upload = require("../middleware/fileUpload")


router.post('/user/register', UserController.addUser)
//router.post('/user/addupdate', userController.addUpdateUser)
//router.get('/user/renderLogin', userController.renderLogin)
router.post('/user/login', UserController.loginUser)
router.get('/user/getuser', userVerifyJwtToken,UserController.getUserDetails)
router.get('/user/getalluser', adminVerifyJwtToken,UserController.getAllUserDetails)

router.patch('/user/changepassword', userVerifyJwtToken,UserController.changePassword)
router.post('/user/forgotpassword', UserController.forgotPassword)
router.post('/user/verifyotp', UserController.verifyOtp)
router.patch('/user/resetpassword', UserController.resetPassword)
router.patch('/user/updateuser', userVerifyJwtToken,upload,UserController.updateUser)
router.post('/user/profilepic', userVerifyJwtToken,upload,UserController.uploadImage)
router.post('/user/logout', userVerifyJwtToken,UserController.logout)



module.exports = router