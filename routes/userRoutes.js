const express = require("express");
const { getUserController,updateProfileController,updateProfileImageController,updateCoverImageController,deleteUserController,followUserController,unfollowUserController,getAllUserController } = require("../controllers/userController");
const { requireSignin } = require("../middleware/authMiddleware");
const singleUpload = require("../middleware/multer")
const router = express.Router()
//----------get single user with userid
router.get("/get-user/:id", getUserController)

//----------get all user with userid
router.get("/get-user", getAllUserController)

//--------------update user profile with user id
router.put("/update-profile/:id", requireSignin, updateProfileController)
//--------------update user profile with user id
router.put("/update-profile-image/:id", requireSignin,singleUpload, updateProfileImageController)

//--------------update user profile with user id
router.put("/update-cover-image/:id", requireSignin,singleUpload, updateCoverImageController)
//delete user 
router.delete("/delete-user/:id",requireSignin, deleteUserController)

//follow user
router.put('/follow/:id',requireSignin,followUserController)

//unfollow user
router.put("/unfollow/:id",requireSignin,unfollowUserController)
module.exports= router