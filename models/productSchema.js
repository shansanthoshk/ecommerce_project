const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    image:[{
        type:String,
    }],
    stock:{
        type:Number,
        require:true,
    },
    isDelete:{
       type:Boolean,
       default:false, 
    },


})

const productCollection= new mongoose.model("products",productSchema);
module.exports=productCollection;