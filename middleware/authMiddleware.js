const JWT = require("jsonwebtoken")

//Protected routes token base
const requireSignin = async(req,res,next)=>{
    try {
     const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
     req.user=decode
     next()
    } catch (error) {
     console.log(error)
    }
 }

 module.exports = {requireSignin}