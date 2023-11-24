const express = require('express')
const router = express.Router()
const productcontroller = require('../controller/productcontroller')
const{sellerVerifyJwtToken,userVerifyJwtToken,adminVerifyJwtToken} =require('../middleware/auth')
const { productSchema } = require('../services/productvalidation');
const upload = require("../middleware/fileUpload")

router.post('/product/add', sellerVerifyJwtToken, productcontroller.addProduct)
router.patch('/product/productstatus/:id', adminVerifyJwtToken, productcontroller.productStatusChange)
router.post('/product/favorite', userVerifyJwtToken, productcontroller.likeDislikeProduct)
router.post('/product/allproduct', userVerifyJwtToken, productcontroller.allProduct)
router.post('/product/search', userVerifyJwtToken, productcontroller.searchProduct)
router.get('/product/favoriteproduct', userVerifyJwtToken, productcontroller.favoriteProduct)
router.get('/product/aggregatetest', userVerifyJwtToken, productcontroller.demoaggregate)
router.patch('/product/productimag', sellerVerifyJwtToken,upload,productcontroller.uploadImage)
module.exports = router