const userCollection = require("../models/userSchema");
const dotenv=require('dotenv').config();


const adminDashboard= async (req,res)=>{
    res.render('dashboard');
}


const adminLog=async (req,res)=>{
    console.log("yuyuu");
    let err=''
    res.render('adminlogin',{err})
}

const adminCheck= async function(req,res){
    const email='admin@gmail.com'
    const password='12345';
    

    if(req.body.email === process.env.ADMINEMAIL && req.body.password === process.env.PASSWORD){
        //console.log("fvdj");
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
    res.status(500).send("Internal server error");
    }
}


const userBlock= async (req,res)=>{
    try{
        const id=req.params.id;
        console.log("kvd");
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
        console.log("uio");
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
        
    
        res.render('productManagement',{
            user
        });
    } catch(err){
        console.error("Error:",err);
        res.status(500).send("Internal server error");
        }
}

const adminCategoryManagement= async (req,res)=>{
    try{
        const user= await userCollection.find();
        
    
        res.render('categoryManagement',{
            user
        });
    } catch(err){
        console.error("Error:",err);
        res.status(500).send("Internal server error");
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
    adminCategoryManagement
}