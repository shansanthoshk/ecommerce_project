const express= require('express');
const path= require('path');
const admin_Route=express();
const session= require('express-session');
const productController= require('../controller/productController')

const adminController=require('../controller/adminController');


const multer= require('multer');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'))
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name)
    }
})
const upload=multer({storage:storage}).array('image',3)




admin_Route.use(express.static(path.join(__dirname,'public')))
admin_Route.use(express.urlencoded({extended:true}));
admin_Route.use(express.json());







//setting view engine:

admin_Route.set('view engine','ejs')
admin_Route.set('views',path.join(__dirname,'../views/admin'));



const adminAuth=require('../middleware/adminAuth');



admin_Route.get('/adminlogin',adminController.adminLog)
admin_Route.post('/admin/adminlogin',adminController.adminCheck) 
admin_Route.get('/dashboard',adminController.adminDashboard)

admin_Route.post('/block/:id',adminController.userBlock)
admin_Route.post('/unblock/:id',adminController.userUnblock)

admin_Route.post('/category/unblock/:id',adminController.categoryUnblock)
admin_Route.post('/category/block/:id',adminController.categoryBlock)

admin_Route.get('/editCategoryLoad/:id',adminController.categoryEdit)
admin_Route.get('/editProductLoad',productController.productEdit)


admin_Route.post('')
admin_Route.get('/user',adminController.adminUser)
admin_Route.get('/productManagement',adminController.adminProductManagement)
admin_Route.get('/categoryManagement',adminController.adminCategoryManagement)




admin_Route.get('/addCategoryLoad',adminController.adminCategoryAdd)
admin_Route.post('/addCategoryLoad',adminController.adminCategoryInsert)

admin_Route.get('/productAddLoad',productController.productsLoad);
admin_Route.post('/productsAddLoad',upload,productController.productsInsert)

admin_Route.get('/productsList/:id',productController.productList);
admin_Route.get('/productsUnlist/:id',productController.productsUnlist);

admin_Route.get('/productsEdit/:id',productController.productsEdit)
admin_Route.post('/productsEditUpdate/:id',productController.productsEditUpdate)





module.exports=admin_Route;