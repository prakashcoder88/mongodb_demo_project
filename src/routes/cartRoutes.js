const express = require('express')
const router = express.Router()
const cartcontroller = require('../controller/cartControllor')
const{userVerifyJwtToken} =require('../middleware/auth')


router.post('/cart/add', userVerifyJwtToken,cartcontroller.addCart)
router.get('/cart/cartlist', userVerifyJwtToken,cartcontroller.userCartList)
router.patch('/cart/quntityupdate', userVerifyJwtToken,cartcontroller.productQuantityUpdate)

module.exports = router