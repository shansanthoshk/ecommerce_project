const express=require('express')
const path = require('path')
const user_Route=express()
const session=require('express-session')

const userController=require('../controller/userController')

user_Route.use(express.urlencoded({extended:true}))
user_Route.use(express.json())

// setting the static pages
user_Route.use(express.static('public'))     

// setting the view engines
user_Route.set('view engine','ejs')
user_Route.set('views','./views/user')
user_Route.use(express.static(path.join(__dirname,'public')))


// session handleing 
// user_Route.use(session({
//     secret : "secret-key" ,
//     saveUninitialized : false,
//     resave : false
// }))
user_Route.get('/',userController.home)

user_Route.get('/login',userController.loginLoad)

user_Route.get('/signup',userController.signupLoad)

user_Route.get('/forget',userController.forgetLoad)

user_Route.post('/signup',userController.signupPost)

user_Route.post('/newotp',userController.newOtp)

user_Route.get('/otp',userController.getOtp);

user_Route.post('/user/otp',userController.otpPost);

user_Route.post('/user/login',userController.loginPost);







module.exports=user_Route;

