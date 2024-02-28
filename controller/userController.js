const userCollection=require('../models/userSchema')
const generateOtp=require('otp-generator')
const otpSchema=require('../models/otp')
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const dotenv = require('dotenv').config();


const loginLoad=async(req,res)=>{

    try{
        res.render('login')
    
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
let userData;
let transporter;
let email;


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
    // try{

    //     const data={
    //         name:req.body.name,
    //         email:req.body.email,
    //         password:req.body.password
    //     }

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
            console.log("user",user);
            
            
            const email=user.email;
            
            req.session.email=email;
            console.log("emaill",email);
            

            otp = generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });

            sendOtp(otp, user.email)
            res.render("otp")
    
        }
    }catch(error){
            console.error(error)
            res.status(500).send("Internal server error");
    }
}


const getOtp = async (req, res) => {
    try {
  
      res.render("otp");
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
      const otp = await generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
  
  
      sendOtp(otp, email);
  
  
  
      res.redirect("/user/otp")
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
        console.log("hello");
        
        const enteredOtp= req.body.otp;
        console.log(enteredOtp);
        console.log(otp);

        if(enteredOtp===otp){
            console.log("Done!!");
            await userCollection.insertMany([user]);
            res.redirect('/login');
        }else{
            res.redirect('user/otp'); //Fail
        }


    }catch(err){
        console.error("Error:",err);
        res.status(500).send("Internal server error");
    }
  }



  const loginPost= async (req,res)=>{
    try{
        const check= await userCollection.findOne({email:req.body.email,password:req.body.password});

        if(check){
            if(check && check.password===req.body.password){
                req.session.userId = check._id.toString();
                console.log("Successfull");
                console.log("User ID:",req.session.userId);
                const isUserBlocked1 = await userCollection.findOne({ _id: req.session.userId }, { blocked: 1 })
                const isUserBlocked = isUserBlocked1.blocked;

                if (isUserBlocked == false) {
                    console.log("Login successful. User ID:", req.session.userId);
                    res.redirect("/");
                  }
                  else {
                    res.render('user/login')
                  }
            }else {
                // Prepare  error messages for email and password
                res.render("user/login", { error: "Invalid Password" })
              }
        }else {
            res.render("user/login", { error: "Email not found" })
          }
    }catch(err){
        console.log("ERROR",err);
        res.status(500).send("Internal server error");

    }
  };

  const home= async (req,res)=>{
    
        res.render('home');

    
  }

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
    logout
}