const Joi = require('joi')

const productSchema = Joi.object({
    productName:Joi.string().required().messages({
        'string.base':"Product name must be string",
        'string.empty':"Product name required"
    }),
    description:Joi.string(),
    price:Joi.number(),
    date:Joi.date(),
    reviews:Joi.number()

})
module.exports={productSchema}