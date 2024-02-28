const isLogin=(req,res,next)=>{
    if(req.session.userId){
        next();
    }
    else{
        res.redirect('/login');
    }
}

const isLogout=async (req,res,next)=>{
    try{
        if(req.session.userId){
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
