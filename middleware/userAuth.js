const isLogin=(req,res,next)=>{
    if(req.session.user1){
        next();
    }
    else{
        res.redirect('/login');
    }
}

const isLogout=async (req,res,next)=>{
    try{
        if(req.session.user1){
            res.redirect('/');
        }
        next();
    }catch(err){
        console.log("Error",err.message);
    }
}


module.exports={
    isLogin,
    isLogout
}
