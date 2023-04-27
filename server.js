const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv")
const cors   = require('cors')
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const tweetRoutes = require("./routes/tweetRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
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
app.use(express.static(path.join(__dirname,'./client/build')))

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/tweet', tweetRoutes)
app.use('/api/v1/upload',uploadRoutes)

//rest api

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

//PORT
const PORT =process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`.bgCyan.white)
})
