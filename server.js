const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv")
const cors   = require('cors')
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const tweetRoutes = require("./routes/tweetRoutes")
const cloudnary =require("cloudinary")
const path = require("path")


//configuire env
dotenv.config() 

//database connection
connectDB()




//test object
const app = express()

//middleware
app.use(cors())
app.use(express.json())
//to serve images folder
app.use(express.static('public'))
app.use("/images", express.static("images"))
app.use(express.static(path.join(__dirname,'../client/build')))

//cloudnary
cloudnary.v2.config({
    cloud_name: process.env.CLOUDNARY_CLIENT_NAME,
    api_key: process.env.CLOUDNARY_CLIENT_API,
    api_secret: process.env.CLOUDNARY_CLIENT_SECERT,
})

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/tweet', tweetRoutes)


//rest api

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'../client/build/index.html'));
})

//PORT
const PORT =process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})