const express = require('express')
const path = require('path')
const user_Route = express();
const isBlock= require('../middleware/isBlock');
// const session = require('express-session')

const userController = require('../controller/userController')
const userAuth = require('../middleware/userAuth');
// const {isBlock} = require('../middleware/isBlock');



user_Route.use(express.urlencoded({ extended: true }))
user_Route.use(express.json())


// setting the static pages
// user_Route.use(express.static('public'))     

// setting the view engines
user_Route.set('view engine', 'ejs')
user_Route.set("views", path.join(__dirname, "../views/user"));





user_Route.get('/',userAuth.isLogin,isBlock,userController.home)

user_Route.get('/logout', userController.logout)

user_Route.get('/login', userController.loginLoad)

user_Route.get('/signup', userController.signupLoad)

user_Route.get('/forget', userController.forgetLoad)

user_Route.post('/signup', userController.signupPost)


user_Route.get('/otp', userController.getOtp);

user_Route.post('/user/otp', userController.otpPost);

user_Route.get('/user/newotp', userController.newOtp);



user_Route.post('/login', userController.loginPost);

user_Route.get('/productdetails/:id',userController.productdetails)







module.exports = user_Route



