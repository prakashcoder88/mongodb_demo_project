const express = require('express')
const router = express.Router()
const orderControllor = require('../controller/orderControllor')

const{userVerifyJwtToken} =require('../middleware/auth')




router.post("/order/ordercreate", userVerifyJwtToken,orderControllor.orderCreate )
//router.get("/order/payment", orderControllor.renderProductPage )


module.exports = router