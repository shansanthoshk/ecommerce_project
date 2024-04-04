const userCollection=require('../models/userSchema')
const productCollection = require('../models/productSchema');
const Cart = require('../models/cartSchema');

const generateOtp=require('otp-generator')
const otpSchema=require('../models/otp')
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { log } = require('console');
const otp = require('../models/otp');
const dotenv = require('dotenv').config();


const loginLoad=async(req,res)=>{

    try{
        res.render('login',{error:""})
    
}catch(error){
    console.log(error)
    res.status(500).send('Internal Server Error');
}
}

const signupLoad= async(req,res)=>{
    try{
        let errorMessage='';
        res.render('register' ,{ errorMessage })
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
    }
}

const forgetLoad= async(req,res)=>{
    try{
        res.render('forgetPassword')
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
    }

}

//var otp;
let user = false;
let transporter;



const login = async (req,res)=>{
    try{
        const error='';
        if( req.session.userId){
            res.redirect('/');

        }else{
            res.render('user/login',{error});
        }
    }catch(err){
        console.error("Error",err);
        res.send("hey")
   }
}


function sendOtp(otp,email){
    transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'shansanthoshfcb10@gmail.com',
            pass:'jshopgysvdzvaioq',
        },
    });

    const mailOptions={
        from:"shansanthoshfcb10@gmail.com",
        to:`${email}`,
        subject:"Verification!!",
        text:`Your OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error("Error sending OTP:",error);
        }else{
            console.log('OTP send!!',info.response);
        }
    }) 
}



const signupPost= async(req,res)=>{
    console.log('CONTROLLES D');
    // try{

        // const data={
        //     name:req.body.name,
        //     email:req.body.email,
        //     password:req.body.password
        // }

    //     await userCollection.insertMany([data])
    //     res.render('login')
    // }catch(err){
    //     res.status(500).send('Internal Server Error')
    // }
    try{
        const check= await userCollection.findOne({email: req.body.email})
        if(check){
            const errorMessage='Email already exist';
            console.log(errorMessage);
            res.redirect(`/signup?error=${encodeURIComponent(errorMessage)}`)

        }else{
            user={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            }

            console.log(user);
            
            
            const email=user.email;
            req.session.userData = user;
            req.session.email=email;
            console.log("emaill",email);
            

            const otp = generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
console.log('generated otp',otp);
            sendOtp(otp, user.email)
            



            const newOTP = new otpSchema({
                email: email,
                otp: otp
            });
    
            // Save the new OTP data to the database
            const savedOTP = await newOTP.save();

            res.render("otp",{error:""})
    
        }
    }catch(error){
            console.error(error)
            res.status(500).send("Internal server error");
    }
}


const getOtp = async (req, res) => {
    try {
  
      res.render("otp",{error:""});
    }
    catch (error) {
      console.error(error)
      res.status(500).send("Internal server error");
    }
  }



  const newOtp = async (req, res) => {
    try {
  
      const email = req.session.email;
      console.log("22222", email);
      const newOtp = await generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
      console.log("newOtp",newOtp);
  
  
      sendOtp(newOtp, email);
  
  
  
      res.redirect("/otp")
    }
    catch (error) {
      console.error(error)
      res.status(500).send("Internal server error");
    }
  }

  const passOtp = (req, res) => {
    const otp = req.session.otp
    console.log('potp od', otp);
    const check = req.session.check
    console.log('chec i dd', check)
    if(req.session.invalid){
      req.session.invalid = false
      res.render("user/passotp",{message :req.session.errmsg });
  
    }
    res.render("user/passotp",{message:''});
  }

  const otpPost= async (req,res)=>{
    try{
        console.log("otp post");
        
        const enteredOtp= req.body.otp;
        const email = req.session.email;
        console.log("user entered otp"+enteredOtp);
        
        const otpData = await otpSchema.findOne({ email: email }).exec();

        if (!otpData) {
            console.log("No OTP found for the provided email");
            // new otp haS SEND 
            const otp = generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
            console.log('generated otp',otp);
                        sendOtp(otp, user.email)
                        
            
            
            
                        const newOTP = new otpSchema({
                            email: email,
                            otp: otp
                        });
                
                        // Save the new OTP data to the database
                        const savedOTP = await newOTP.save();
            // __________________
            res.render('otp',{error:"New otp has send!"}); // Fail
            return;
        }

        if(enteredOtp===otpData.otp){
            console.log("Done!!");
            await userCollection.insertMany(req.session.userData);

            res.redirect('/login');
        }else{
            res.render('otp',{error:"Wrong OTP!"}); //Fail
        }


    }catch(err){
        console.error("Error:",err);
        res.status(500).send("Internal server error");
    }
  }



  const loginPost= async (req,res)=>{
    try{
        const check= await userCollection.findOne({email:req.body.email});
        console.log(`data of usr` + check);
        if(check){
            if(check && check.password===req.body.password){
                req.session.userId = check._id.toString();
                req.session.userData = check;
                console.log("Successfull");
                console.log("User ID:",req.session.userId);
                // ___________________________________________
                // const isUserBlocked1 = await userCollection.findOne({ _id: req.session.userId }, { blocked: 1 })
                // const isUserBlocked = isUserBlocked1.blocked;

                // if (isUserBlocked == false) {
                //     console.log("Login successful. User ID:", req.session.userId);
                //     res.redirect("/");
                //   }
                //   else {
                //     res.render('user/login')
                //   }
                // ___________________________________________

                    res.redirect("/");

            }else {
                // Prepare  error messages for email and password
                res.render("login", { error: "Invalid Password" })
              }
        }else {
            res.render("login", { error: "Email not found" })
          }
    }catch(err){
        console.log("ERROR",err);
        res.status(500).send("Internal server error");

    }
  };

 
  const home= async (req,res)=>{
    
        // res.render('home');
        try{
            

            const products= await productCollection
                .find()
                

                console.log(products)

            const users= await userCollection.findOne({email:req.session.user})

            res.render('home',{products,users})

        }catch(err){
            console.error(err)
            res.status(500).send('Internal server error')
        }
    };




  const logout= async (req,res)=>{
    req.session.destroy(function (err){
        if(err){
            console.log(err);
            redirect('/login');
        }else{
            console.log("Logout successful");
            res.status(200);
            res.redirect('/login');
        }
    })
  }


  const productdetails = async (req,res)=>{
        try{
            const id=req.params.id;
            console.log("ID",id);
            const products= await productCollection.findById(id);
            res.render('productDetails',{products})

        }catch(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        
  }

  const verifyEmail= async (req,res)=>{
    try{
        const userremail=await userCollection.findOne({email:req.body.email})
        if(userremail){
            otp=generateOtp.generate(4,{digits:true,alphabets:false,specialChars:false})
            
            transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user: 'testtdemoo11111@gmail.com',
                      pass: 'wikvaxsgqyebphvh',
                },
        })
        const mailOptions={
            from:`${req.body.email}`,
            to:`${req.body.email}`,
            subject:"Your Otp code",
            text:`your otp code is:${otp}`
        }
        transporter.sendMail(mailOptions,(error,info) =>{
            if(error){
                console.error("error sending otp",error)
    
            }
            else{
                console.log("otp send:",info.response);
            }
    
        })
        let errorMessage=''
        res.render('forgototp',{errorMessage,user:userremail._id})


        }else{
            let error='Email not match'
            res.render('forgot',{error})
        }


    }catch(err){
        console.log("err",err)
    }
  }

  const cartGet = async (req,res)=>{
    try {
        res.render('cartPage')
    } catch (error) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
        
  }

  const addToCart = async (req, res) => {
        try {
            console.log("add to cart");
            const productId = req.params.id;
            const user = req.session.userData;
            console.log(req.session.userData);
            console.log("add to id", productId);

            let userData = await userCollection.findById(user._id);
            if (!userData) {
                return res.redirect('/');
            }
            // check pont 1_____________________________________________________________;

            const productData = await productCollection.findOne({ _id: productId });

            let userCart = await Cart.findOne({ userId: userData._id });
            // check point 2___________________________________________________________;

            if (!userCart) {
                console.log('no cart');
                // =================================
                let value = 1;
                // console.log(productData.product_status);
                // if (productData.product_status === false) {
                //     value = 0;
                // }
                // =================================
                userCart = new Cart({
                    userId: userData._id,
                    items: [
                        {
                            product: productId,
                            quantity: value,
                            product_price: productData.price,
                        },
                    ],

                    total: productData.price * value,
                    totalQuantity: value,
                });
                await userCart.save();
                // check point 3________________________________________________________;
            } else {
                // =================================
                console.log("ADDING......................");
                let value = 1;
                // console.log(productData.product_status);
                console.log(`serching id ${productId}`);
                // if (productData.product_status === false) {
                //     value = 0;
                // } else {
                //     value = 1;
                // }
                // =================================
                await Cart.updateOne(
                    { userId: userData._id },
                    {
                        $push: { items: { product: productId, quantity: value, product_price: productData.price } }

                    }
                )

                if (value == 1) {
                    let cartdata = await Cart.findOne({ userId: userData._id });
                    const productIn_items = cartdata.items.find(
                        (item) => item.product.toString() === productId,
                    );
                    // console.log(`product st true ?:id ${productIn_items.product}`);


                    cartdata.total += productIn_items.product_price;
                    cartdata.totalQuantity += 1;
                    await cartdata.save();

                }



            }

            console.log("data saved");


            let data = productId;

            res.json(data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
  

module.exports={
    loginLoad,
    signupLoad,
    forgetLoad,
    signupPost,
    getOtp,
    sendOtp,
    newOtp,
    otpPost,
    passOtp,
    loginPost,
    home,
    logout,
    productdetails,
    verifyEmail,
    cartGet,
    addToCart,
    

}