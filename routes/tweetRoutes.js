const express = require("express")
const {createTweetController,ImageTweetController,updatetweetController,deletetweetController,likeTweetController,getAllTimelineController,getTweetController, getExploreTweets,commentTweetController} = require("../controllers/tweetController")
const { requireSignin } = require("../middleware/authMiddleware")
const singleUpload = require("../middleware/multer")
const router = express.Router()
//create Tweet
router.post("/create-tweet",requireSignin,createTweetController)
//image
 router.post("/upload",requireSignin,singleUpload,ImageTweetController)

//get a tweet
router.get("/get-tweet/:id",getTweetController)

//update tweet
router.put("/update-tweet/:id",requireSignin,updatetweetController)

//delete tweet
router.delete("/delete-tweet/:id", requireSignin, deletetweetController)

//like tweet 
router.put("/:id/like",likeTweetController)
//comment tweet 
router.put("/:id/comment",requireSignin,commentTweetController)

//timeline
router.get("/:id/timeline", getAllTimelineController)

//explore tweet
router.get("/explore", getExploreTweets)
module.exports=router