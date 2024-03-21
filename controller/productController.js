const dotenv=require('dotenv').config();
const productCollection = require('../models/productSchema');
const categorycollection = require('../models/categorySchema');


const productsLoad= async (req,res)=>{
    try{

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const categories= await    categorycollection.find({isDeleted:false})
        const skip = (page - 1) * limit;

        const products = await productCollection.find().skip(skip).limit(limit);
        const totalProducts = await productCollection.countDocuments();

        const totalPages = Math.ceil(totalProducts / limit);
        let error='';
        let error2='';

        res.render('productAddLoad',{error,categories,error2, products, totalPages, currentPage: page})

    }catch(err){
        console.error("Error",err)
        res.status(500).send('Internal Server Error');

    }
}

const productsInsert= async (req,res)=>{
            try{              
                const enteredProductName = req.body.name.toLowerCase();
                const categories = await categorycollection.find({ isDeleted: false }); 
                const existingProduct = await productCollection.findOne({
                name: { $regex: new RegExp('^' + enteredProductName + '$', 'i') }
                    });

                    if (existingProduct) {
                        res.render('productAddLoad', { error: 'Product already exists', categories});
            
                    } else {
                        const price= Number(req.body.price);
                        
                        if(price>0){
                            const productData={
                                name: req.body.name,
                                description:req.body.description,
                                price:req.body.price,
                                category: req.body.category,
                                image:req.files.map(file=>file.filename),
                                // image: req.files ? req.files.map(file => file.filename) : [],
                                stock: req.body.stock,
                            };
                            await productCollection.insertMany([productData]);
                            res.redirect('productManagement');
                        }else{
                            let error=''
                            res.render('productAddLoad',{error2:"Price cannot be a negative value or zero!!",categories,error});
                        }
                        
                    }
                    }catch(err){
                        console.error(err);

            }
        }
    
            
            
            
        


    


const productEdit= async (req,res)=>{

res.redirect('/productManagement')
}

const productList= async (req,res)=>{
    try{
        const id=req.params.id;
        console.log(id);
        const result= await productCollection.findByIdAndUpdate(id,{isDelete: false });
        if(result){
            console.log('hetyyyy');
            res.redirect('/productManagement')
        }else{
            console.log('product not found')
        }
    }catch(error){
        console.error('Error deleting user:',error)
    }
}

const productsUnlist= async (req,res)=>{
    try{
        const id=req.params.id;
        const result= await productCollection.findByIdAndUpdate(id,{isDelete: true });
        console.log(result);
        console.log(id);
        if(result){
            console.log('oooi');
            res.redirect('/productManagement')
        }else{
            console.log('product not found')
        }
    }catch(error){
        console.error('Error deleting user:',error)
    }
}

const productsEdit= async (req,res)=>{
    try{
        let id = req.params.id;
       const categories= await categorycollection.find()
        const errorMessage=''
        productCollection.findById(id)
        .then(product=>{
            
            if(!product){
                res.redirect('/productManagement')
            }else{
                res.render('productEditLoad',{product,errorMessage,categories})
            }
        })
        .catch(error =>{
            console.log("Error in finding the products : ", error);
            res.redirect('/admin/products')
        })
    }catch(error){
        console.error('Error editing user:',error)
    
    }
}

const productsEditUpdate= async (req,res)=>{
    try {
        console.log('pari',req.body.price);
        const enteredProductName = req.body.name.toLowerCase();
        
        let id = req.params.id;
        const product=await productCollection.findById(id)
        let imageFiles = [];
        if (req.files) {
            imageFiles = req.files.map(file => file.filename);
        }

        const existingProduct = await productCollection.findOne({
            $and: [
                { name: { $regex: new RegExp('^' + enteredProductName + '$', 'i') } },
                { _id: { $ne: id  } }
            ]
        })

        if (existingProduct) {
        
            res.render('productEditLoad',{product,errorMessage:'product Already Exist'}) // You may want to handle this case differently
        } else {
            const productData = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                ...(imageFiles.length > 0 && { image: imageFiles }),
                stock: req.body.stock,
                OfferPrice: req.body.offerprice,
                Discount: req.body.discount,
            };

        
            const result = await productCollection.findByIdAndUpdate(id, productData);

            if (!result) {
                console.log('Product not found');
            } else {
                res.redirect('/productManagement')
            }
        }
    } catch (err) {
        console.log('Error updating the product: ', err);
        
    }

}





module.exports= { productsLoad, productsInsert, productEdit,productList ,productsUnlist,productsEdit,productsEditUpdate};