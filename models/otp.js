const mongoose = require('mongoose')

const otpSchema=new mongoose.Schema({
    
    email:{
        type:String,
        
    },
    otp:{
        type:String,
        required:true
    },
createdAT:{type:Date,default:Date.now,index:{expires:30}}
},{timestamps:true})


const otp= mongoose.model('OTP',otpSchema);
module.exports=otp;