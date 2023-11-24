const Joi = require('joi')

const userSchema = Joi.object({
    name: Joi.string().max(50), 
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
    role: Joi.string().valid('user', 'admin'),
    profileImage: Joi.string().uri()
})
module.exports ={
    userSchema
}