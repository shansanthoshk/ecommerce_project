const express= require('express')
const app=express();
const mongoose=require('mongoose')
const crypto=require('crypto')
require('dotenv').config();
const path = require('path')
const session = require('express-session')


app.use(session({
  secret : "secret-key" ,
  saveUninitialized : false,
  resave : false
}))


mongoose.connect('mongodb://0.0.0.0:27017/projectDataBase')
.then(()=>{
    console.log("MongoDb connected!!")
})
.catch((err)=>{
    console.log("Error connecting",err)
})

app.use(express.static(path.join(__dirname, 'public')));
console.log("jyfyjh");





const userRoute=require('./routes/userRoute')
app.use('/',userRoute)

const adminRoute=require('./routes/adminRoute')
app.use('/',adminRoute);

const sessionSecret = crypto.randomUUID();
// app.use(session({
//     secret: sessionSecret,
//     saveUninitialized: true,
//     resave: false,
//     cookie: {
  
//       secure: false
//     }
//   }))


app.listen(7000,()=>{
    console.log("Port connected!!")
})

