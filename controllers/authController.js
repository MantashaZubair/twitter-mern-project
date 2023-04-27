const { hashPassword, comparePassword } = require("../helpers/authHelper")
const userModels = require("../models/userModels")
const JWT = require("jsonwebtoken")

const registerController =async(req,res)=>{
try {
  const {name,username,email,password} = req.body  
  //validataion
  if(!name || !username|| !email || !password){
    return res.status(400).json({messsage:"one or more mandatory is empty"})
  }
  //check useremail
  const existingUser = await userModels.findOne({email:email})
    //check username
    const existingUsername = await userModels.findOne({username:username})
  //existing user
  if(existingUser){
    return res.status(400).send({
      success:false,
      message:'email is already Register'
    })
  }//existing username
  else if(existingUsername){
    return res.status(400).send({
      success:false,
      message:'user name is already exist'
    })
  }else{
  const hashedPassword= await hashPassword(password)
  //save
  const user= await new userModels({name,username,email,password:hashedPassword}).save()
  const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
  res.status(200).send({
    success:true,
    message:"successfully register",
    user,
    token
  })
}
} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"Some thing went wrong while register",
    error
  })  
}
}
//login
const loginController = async(req,res)=>{
  try {
    const {email,password}= req.body
    //validation
    if (!email || !password){
      res.status(404).send({
        success:false,
        message:"invalid email or password"
      })
    }
    //check user
    const user = await userModels.findOne({email})
    if(!user){
      res.status(404).send({
        success:false,
        message:"Email is not register"
      })
    } 
    const match = await comparePassword(password,user.password)
    if(!match){
      res.status(400).send({
        success:true,
        message:"invalid password"
      })
    }
  else{
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).json({
      success:true,
      message:"Login Successfull",
      user,
      token
    })
  }


  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Something went worng while login",
      error
    })
  }
}


module.exports= {registerController,loginController}