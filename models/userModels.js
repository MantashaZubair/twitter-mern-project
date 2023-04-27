const mongoose = require("mongoose")

const  userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
       },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    location:{
        type: String
     },
     profilePicture:{
        type:String
     },
     coverPicture:{
         type:String
     },
     DOB:{
        type:Date
     },
     followers:{
        type:Array,
        defaultValue:[]
     },
     following:{
        type:Array,
        defaultValue:[]
     },
   description:{
    type:String
    },
},{timestamps:true})


module.exports= mongoose.model("user" , userSchema)