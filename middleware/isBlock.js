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
    console.log("BLOCK MIDDLEWIRE");

    const userId=req.session.userId;
    console.log("data od id"+ userId);
    if(!userId){
        return  res.render('user/login',{error:""})
    }
    console.log(userId);
    const isBlocked1= await userCollection.findOne({_id: userId});
    console.log(isBlocked1.blocked);
    if(isBlocked1.blocked === true){
      return  res.render('login',{error:"This email is blocked by admin"})
    }
    next();
    // const isBlocked = isUserBlocked1.blocked;
    // console.log(isBlocked1);

}

module.exports= isBlock;