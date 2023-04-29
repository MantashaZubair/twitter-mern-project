const userModels = require("../models/userModels")
const tweetModel = require("../models/tweetModel")
const { hashPassword } = require("../helpers/authHelper")
const JWT = require("jsonwebtoken")
const getDataUri = require("../utils/dataUri")
const cloudnary =require("cloudinary")

//get user with userid

const getUserController = async(req,res)=>{
try {
    const user = await userModels.findById(req.params.id)
    if(user){
      const {password, ...otherDetails} = user._doc
      res.status(200).json(otherDetails )
    }else{
      res.status(404).send({
        success:false,
        message:"No such user exists"
    })
    }
} catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while getting user",
      error
    })  
  }
}


///get all users

const getAllUserController = async(req,res)=>{
try {
  const user =  await userModels.find()
  res.status(200).json(user)
} catch (error) {
  console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while getting user",
      error
    }) 
}
}

//update profile controller
const updateProfileController =async(req,res)=>{   
try {
    const {name,DOB,location,description,password,profilePicture,coverPicture}= req.body
    const users = await userModels.findById(req.user._id);
      //password
      if(password && password.length < 6){
        return res.json({error:"password is required and 6 character long"})
    }
    //hashedpassword
    const hashedPassword = password ? await hashPassword(password) : undefined;
  
    
    const user = await userModels.findByIdAndUpdate(req.user._id,{
        name:name ||users.name,
        password:hashedPassword ||users.password,
        DOB:DOB ||users.DOB,
        description:description||users.description,
        location:location || users.location,
        profilePicture:profilePicture || users.profilePicture,
        coverPicture:coverPicture || users.coverPicture,
    },{new:true})
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).json({
        success:true,
        message:"profile updated Successfully",
        user,
        token
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while updating user",
      error
    }) 
}
}
 
//update prifile image
const updateProfileImageController = async(req,res)=>{
  try {
    
    const users = await userModels.findById(req.user._id);
    const file = req.file;
    const fileUri=getDataUri(file)
    const mycloud = await cloudnary.v2.uploader.upload(fileUri.content)

    const user = await userModels.findByIdAndUpdate(req.user._id,{
     profilePicture:mycloud.secure_url|| users.profilePicture,
    },{new:true})
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).json({
        success:true,
        message:"profile updated Successfully",
        user,
        token
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while updating user",
      error
    }) 
}
}

const updateCoverImageController =async(req,res)=>{
  try {
    
    const users = await userModels.findById(req.user._id);
    const file = req.file;
    const fileUri=getDataUri(file)
    const mycloud = await cloudnary.v2.uploader.upload(fileUri.content)

    const user = await userModels.findByIdAndUpdate(req.user._id,{
      coverPicture:mycloud.secure_url|| users.coverPicture,
    },{new:true})
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).json({
        success:true,
        message:"profile updated Successfully",
        user,
        token
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while updating user",
      error
    }) 
}
}



const deleteUserController = async(req,res)=>{
  try { 
    await userModels.findByIdAndDelete(req.params.id);
     await tweetModel.deleteMany({"userId" : req.params.id});
    res.status(200).send({
      success:true,
      message:"Successfully deleted user profile"
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Some thing went wrong while deleting user",
      error
    }) 
  }
}


//follow userController
const followUserController = async(req,res)=>{
try {
  const user = await userModels.findById(req.params.id);
  const currentUser = await userModels.findById(req.body.id);
  if (!user.followers.includes(req.body.id)){
    await user.updateOne({
      $push:{followers:req.body.id}
    });
    await currentUser.updateOne({$push: { following:req.params.id},})
  }else{
    res.status(403).json("you already follow this user")
  }
  res.status(200).send({
    success:true,
    message:"following the user"
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"Some thing went wrong while following user",
    error
  }) 
}
}

//unfollow userController
const unfollowUserController = async (req,res)=>{
try {
  const user = await userModels.findById(req.params.id)
  const currentUser = await userModels.findById(req.body.id)
  if (currentUser.following.includes(req.params.id)){
    await user.updateOne({
      $pull:{followers:req.body.id}
    })
    await currentUser.updateOne({$pull: { following:req.params.id}})
  }else{
    res.status(403).json("you unfollow this user")
  }
  res.status(200).send({
    success:true,
    message:"unfollowing the user"
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
    success:false,
    message:"Some thing went wrong while unfollowing user",
    error
  })
}
}

module.exports = {
  getUserController,
  getAllUserController,
  updateProfileController,
  updateCoverImageController,
  updateProfileImageController,
  deleteUserController,
  followUserController,
  unfollowUserController,
  }