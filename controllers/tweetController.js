const tweetModel = require("../models/tweetModel")
const userModels = require("../models/userModels")
const getDataUri = require("../utils/dataUri")
const cloudnary =require("cloudinary")


//create tweet controller
const createTweetController = async(req,res)=>{
try {
    const {content,userId} = req.body
    const newTweet = new tweetModel({content,userId})
   await newTweet.save()
  res.status(200).send({
    success:true,
    message:"saved tweet",
    newTweet
  })  
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went worng while creating tweet",
        error
      })
}
}



//  const createTweetController = async(req,res)=>{
// try {
//     const {content,userId} = req.body
//     if(!content||!userId)
//      return res.status(400).json({messsage:"content is empty"})

//      const file = req.file;
//      const fileUri=getDataUri(file)
   
//      const mycloud = await cloudnary.v2.uploader.upload(fileUri.content)
//      const newTweet = new tweetModel({content,userId,image:{public_id:mycloud.public_id,url:mycloud.secure_url}})
//    await newTweet.save()
//   res.status(200).send({
//     success:true,
//     message:"saved tweet",
//     newTweet
//   })  
// } catch (error) {
//     console.log(error)
//     res.status(500).send({
//         success:false,
//         message:"Something went worng while creating tweet",
//         error
//       })
// }
// }
const ImageTweetController = async(req,res)=>{
    try {
        const {content,userId} = req.body
             if(!content||!userId)
          return res.status(400).json({messsage:"content is empty"})
         const file = req.file;
         const fileUri=getDataUri(file)
         const mycloud = await cloudnary.v2.uploader.upload(fileUri.content)
         const newTweet = new tweetModel({content,userId,photo:mycloud.secure_url})
       await newTweet.save()
      res.status(200).send({
        success:true,
        message:"saved tweet",
        newTweet
      })  
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went worng while creating tweet",
            error
          })
    }
    }
//get a tweet controller
const getTweetController = async(req,res)=>{
    
    try {
      const gettweet = await tweetModel.find({userId:req.params.id}).sort({
        createdAt:-1
      })
      res.status(200).json(
       
        gettweet
      )
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went worng while geting tweet",
            error
          }) 
    }
}

//update a post
const updatetweetController = async(req,res)=>{
    const tweetId = req.params.id
    const userId = req.body
    try {
        const tweet = await tweetModel.findById(tweetId)
        if(tweet.userId===userId){
            await tweet.updateOne({ $set : req.body})
            res.status(200).send({
                success:true,
                message:"tweet Updated"
            })
        }else{
            res.status(403).send({
                success:false,
                message:"Action forbidden"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went worng while updating tweet",
            error
          }) 
    }
}

//deletetweetController
const deletetweetController = async(req,res)=>{
    
try {
   const data = await tweetModel.findById(req.params.id)
   if(data.userId){
    await data.deleteOne();
    res.status(200).send({
        success:true,
        message:"tweet has been deleted"
    })
   }
   else{
    res.status(500).send({
        success:false,
        message:"Something went worng deleted tweet",
      })
   } 
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went worng while deleting",
        error
      })
}
}

//like tweetControllet
const likeTweetController = async(req,res)=>{
   
try {
    const tweet = await tweetModel.findById(req.params.id)
    if(!tweet.likes.includes(req.body.id)){
        await tweet.updateOne({$push: {likes:req.body.id}})
        res.status(200).send({
            success:true,
            message:"tweet has been liked"
        })
    }else{
        await tweet.updateOne({$pull: {likes:req.body.id}}) 
        res.status(200).send({
            success:true,
            message:"tweet has been disliked"
        })
    }
} 
catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went worng while like tweet",
        error
      }) 
}
}

//comment tweetControllet
const commentTweetController = async(req,res)=>{
    const id = req.params.id
    const comment = req.body
    
    try {
        const tweet = await tweetModel.findById(req.params.id)  
    tweet.comments.push(comment)
    const updatedTweet = await tweetModel.findByIdAndUpdate(id,tweet,{new:true})
    res.json(updatedTweet) 
       
    } catch (error) {
        console.log(error)
    }
    
    
   
    }


      

//get all tweet controller
const getAllTimelineController = async(req,res)=>{
    try {
      const currentUser = await userModels.findById(req.params.id)
      const userTweet = await tweetModel.find({userId:currentUser._id});
      const followersTweet= await Promise.all(
        currentUser.following.map((followerId)=>{
            return tweetModel.find({userId: followerId})
        })
      ) 
     res.status(200).json(userTweet.concat(...followersTweet)
     .sort((a,b)=>{
        return b.createdAt - a.createdAt;
     })
     );
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went worng while getting timelinetweet tweet",
            error
          }) 
    }
}

//get Explore tweet
const getExploreTweets = async(req,res)=>{
    try {
      const getExploreTweets= await tweetModel.find({
        likes:{$exists:true},
      }).sort({likes:-1}) 
      res.status(200).json(getExploreTweets)
    } catch (error) {
        console.log(error)
    }
}


module.exports={createTweetController,ImageTweetController,getTweetController,updatetweetController,deletetweetController, likeTweetController, getAllTimelineController,getExploreTweets,commentTweetController}