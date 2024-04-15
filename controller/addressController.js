const userCollection=require('../models/userSchema')
const addressCollections=require('../models/addressSchema')


const addAddress= async(req,res)=>{

    console.log("adding address controller");
    try{
        const { name, email, phone, address, country, city, zipCode } = req.body;
        const userData = req.session.userData;
        if(!userData)redirect('/');
        console.log(userData);
        let addressData = await addressCollections.findOne({ userId: userData._id });
        addressData = new addressCollections({
            userId: userData._id,
            name,
            phone_number:phone,
            pincode:zipCode,
            address,
            city,
            email,
            country
        });
        await addressData.save();
        return res.json({data:true})
        
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}



module.exports={
    addAddress,

}