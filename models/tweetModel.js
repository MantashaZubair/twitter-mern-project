const mongoose = require("mongoose")
const{ObjectId}=mongoose.Schema.Types;

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

      image:{
        type:String,
      }
  
        
},{timestamps:true})


module.exports= mongoose.model("tweet" , tweetSchema)