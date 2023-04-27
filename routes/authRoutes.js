const express = require("express");
const {registerController,loginController}= require("../controllers/authController");
const { requireSignin } = require("../middleware/authMiddleware");
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post("/register", registerController)

//Login || Method Post 
router.post("/login", loginController )

// router.post("/test", requireSignin,(req,res)=>{
// res.status(200).send({
//     success:true,
//     message:"sucess"
// })
// })

module.exports= router;