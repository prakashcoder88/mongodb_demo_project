const express = require('express')
const router = express.Router()
const orderControllor = require('../controller/OrderControllor')

const{userVerifyJwtToken} =require('../middleware/auth')




router.post("/order/ordercreate", userVerifyJwtToken,orderControllor.orderCreate )
router.post("/order/placeOrder/:id", userVerifyJwtToken,orderControllor.placeOrder )
//router.get("/order/payment", orderControllor.renderProductPage )


module.exports = router