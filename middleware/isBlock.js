// const userCollection = require('../models/userSchema')

// const isBlock= async (req,res,next)=>{

//     const userId=req.session.userId;
//     const isBlocked1= await userCollection.findOne({_id: userId},{blocked:1});

//     const isBlocked = isUserBlocked1.blocked;

//     if(isBlocked ==false){
//         next();
//     }else{
//         res.render('/user/logout');
//     }

// }

// module.exports= isBlock;


const userCollection = require('../models/userSchema')

const isBlock= async (req,res,next)=>{

    const userId=req.session.userId;
    console.log(userId);
    const isBlocked1= await userCollection.findOne({_id: userId});

    // const isBlocked = isUserBlocked1.blocked;

    console.log(isBlocked1);

}

module.exports= isBlock;