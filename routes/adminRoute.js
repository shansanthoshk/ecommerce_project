const express= require('express');
const path= require('path');
const admin_Route=express();
const session= require('express-session');

const adminController=require('../controller/adminController');
//const admin_Route = require('./adminRoute');
admin_Route.use(express.static(path.join(__dirname,'public')))
admin_Route.use(express.urlencoded({extended:true}));
admin_Route.use(express.json());



// admin_Route.use(express.static('public'));

//setting view engine:

admin_Route.set('view engine','ejs')
admin_Route.set('views',path.join(__dirname,'../views/admin'));



const adminAuth=require('../middleware/adminAuth');



admin_Route.get('/adminlogin',adminController.adminLog)
admin_Route.post('/admin/adminlogin',adminController.adminCheck) 
admin_Route.get('/dashboard',adminController.adminDashboard)

admin_Route.post('/block/:id',adminController.userBlock)
admin_Route.post('/unblock/:id',adminController.userUnblock)

admin_Route.post('')
admin_Route.get('/user',adminController.adminUser)
admin_Route.get('/productManagement',adminController.adminProductManagement)
admin_Route.get('/categoryManagement',adminController.adminCategoryManagement)








module.exports=admin_Route;