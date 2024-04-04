const userCollection = require("../models/userSchema");
const categoryCollection=require('../models/categorySchema');
const productCollection = require("../models/productSchema");
const dotenv=require('dotenv').config();


const adminDashboard= async (req,res)=>{
    res.render('dashboard');
}


const adminLog=async (req,res)=>{
    
    let err=''
    res.render('adminlogin',{err})
}

const adminCheck= async function(req,res){
    const email='admin@gmail.com'
    const password='12345';
    

    if(req.body.email === process.env.ADMINEMAIL && req.body.password === process.env.PASSWORD){
       
        res.render('dashboard');
    }else{
        let err='Invalid Credential'
        res.render('adminlogin',{err})
    }
}



const adminUser= async (req,res)=>{
    try{
    const user= await userCollection.find();
    

    res.render('user',{
        user
    });
} catch(err){
    console.error("Error:",err);
    res.render('errorPage')
    res.status(500).send("Internal server error");
    }
}


const userBlock= async (req,res)=>{
    try{
        const id=req.params.id;
        
        const user= await userCollection.findByIdAndUpdate(id,{blocked:true});

        if(!user){
            res.status(400).json({ error:"User not found"});

        }
        res.redirect('/user');
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal server error"})
    }

}

const userUnblock= async (req,res)=>{
    try{
        
            const id=req.params.id;
            const user=await userCollection.findByIdAndUpdate(id,{blocked:false})

            if(!user){
                res.status(400).json({error:"User not found or could not be unblocked"})
                }
                res.redirect('/user');
    }catch(err){
            console.error("Error",err);
            res.status(500).json({error:"Internal server error"});
    }
}


const adminProductManagement= async (req,res)=>{
    try{
        const user= await userCollection.find();
        const product= await productCollection.find();
    
        res.render('productManagement',{
            user,
            product
        });
    } catch(err){
        console.error("Error:",err);
        res.status(500).send("Internal server error");
        }
}


const categoryUnblock= async (req,res)=>{
    try{
        console.log("unblockkkk");
        const id=req.params.id;
        const result= await categoryCollection.findByIdAndUpdate(id,{ isDeleted: false });
        if(result){
            res.redirect('/categoryManagement')
        }else{
            console.log('product not found')
        }
        
    }catch(err){
        console.error('Error deleting category:',err)    
    }
}

const categoryBlock= async (req,res)=>{
    try{
        console.log("blockkkk");
        const id=req.params.id;
        const result= await categoryCollection.findByIdAndUpdate(id,{ isDeleted: true });
        if(result){
            res.redirect('/categoryManagement')
        }else{
            console.log('product not found')
        }

    }catch(err){
        console.error('Error deleting category:',err)

    }
}
// const adminCategoryManagement= async (req,res)=>{
//     try{
//         const category= await categoryCollection.find();
        
    
//         res.render('categoryManagement',{
//             category
//         });
//     } catch(err){
//         console.error("Error:",err);
//         res.status(500).send("Internal server error");
//         }

// }

const adminCategoryManagement = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 3;
        const skip = (page - 1) * perPage;
        
        const totalCategories = await categoryCollection.countDocuments(); 
        const category= await categoryCollection.find().skip(skip).limit(perPage); 
        
        res.render('categoryManagement', {
            category,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / perPage),
            perPage: perPage 
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal server error");
    }
}



const adminCategoryAdd= async(req,res)=>{
    try{
        const error='';
        res.render('categoryAddManagement', {error})

    }catch{

    }
}


const adminCategoryInsert= async (req,res)=>{
    console.log("cat:",req.body.category);
    console.log("desc:",req.body.description);

    try{

        const enteredCategory=req.body.category.toLowerCase();
        console.log('enteredCategory',enteredCategory);
        const existingCategory= await categoryCollection.findOne({
            category: {$regex: new RegExp('^'+ enteredCategory+ '$','i')}
        });
        console.log('existingCategory',existingCategory);
        if(existingCategory){
            res.render('categoryAddManagement', { error: 'Category already exist!!' });
        }else{
        const categoryData={
            category:req.body.category,
            description:req.body.description, 
        }
        await categoryCollection.insertMany([categoryData]);
        res.redirect('/categoryManagement');
    }
    }catch(err){
        console.log("Error",err);
        
    }
}

const categoryEdit= async (req,res)=>{
    console.log("Edit")
    try{
        const id=req.params.id;
        const category=await categoryCollection.findById({ _id:id})
        // console.log()
        console.log(category.description);
        res.render('categoryEdit',{category})
    }catch(err){
        console.error("Error",err);

    }
}


const editCategoryUpdate = async (req,res)=>{
    try{
        console.log("Entered");
        const categoryId = req.params.id;
        const enteredCategory = req.body.category.trim(); 
        const enteredDescription = req.body.description.trim(); 
        const errors = {};

        if (!enteredCategory) {
            errors.category = { msg: 'Category is required.' };
        }

       
        if (!enteredDescription) {
            errors.description = { msg: 'Description is required.' };
        }

        const existingCategory = await categoryCollection.findOne({
            $and: [
                { category: { $regex: new RegExp('^' + enteredCategory + '$', 'i') } },
                { _id: { $ne: categoryId } }
            ],
            isDeleted: false
        });


        if (existingCategory) {
            errors.category = { msg: 'Category already exists.' };
        }

        if (Object.keys(errors).length > 0) {
           
            return res.render('categoryEdit', { category: req.body, errors,message: '' });
        }

        const result = await categoryCollection.findByIdAndUpdate(categoryId, {
            category: enteredCategory,
            description: enteredDescription,
        });

        if (!result) {
            console.log('Category not found');
            
        } else {
            res.redirect('/categoryManagement');
        }

    }catch(err){
        console.error("ErrorEditUpdate",err)
        res.redirect('/admin/category');
    }
}
    


module.exports={
    adminLog,
    adminDashboard,
    adminCheck,
    adminUser,
    userBlock,
    userUnblock,
    adminProductManagement,
    adminCategoryManagement,
    adminCategoryAdd,
    adminCategoryInsert,
    categoryBlock,
    categoryUnblock,
    categoryEdit,
    editCategoryUpdate
}