const mongoose= require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    blocked:{
        type:Boolean,
        required:true,
        default:false
    }


})

const userModel= new mongoose.model("collection_1",userSchema)

module.exports=userModel