const mongoose = require("mongoose")

const  tweetSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
       },
      likes:{
        type:Array,
        defaultValue:[]
      },
      comments:{
        type:Array,
        defaultValue:[]
      },
      photo:{
          type:String,
      }
  
        
},{timestamps:true})


module.exports= mongoose.model("tweet" , tweetSchema)