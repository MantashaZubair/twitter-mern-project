const mongoose = require("mongoose")
const colors = require("colors")
const connectDB = async()=>{
try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
   // "mongodb://localhost:27017/twitterclone"
    console.log(`connected to mongodb  Database ${conn.connection.host}`.bgWhite.white)
   
} catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white)
}
}
module.exports= connectDB;