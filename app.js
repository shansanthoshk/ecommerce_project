const express= require('express')
const app=express()
const mongoose=require('mongoose')
const session=require('express-session')
const crypto=require('crypto')
require('dotenv').config();

const userRoute=require('./routes/userRoute')


const adminRoute=require('./routes/adminRoute')
// app.use('/admin',adminRoute)


app.use(session({
    secret: crypto.randomUUID(),
    saveUninitialized: true,
    resave: false,
    cookie: {
  
      secure: false
    }
  }))



  app.use('/',userRoute)
  
mongoose.connect('mongodb://0.0.0.0:27017/projectDataBase')
.then(()=>{
    console.log("MongoDb connected!!")
})
.catch((err)=>{
    console.log("Error connecting",err)
})


app.listen(7000,()=>{
    console.log("Port connected!!")
})