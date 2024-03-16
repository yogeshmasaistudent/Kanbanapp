
const jwt = require("jsonwebtoken")

const auth = async(req,res,next)=>{
    const token = req.headers.authorization;
     try {
        if(token){
            jwt.verify(token,"yogesh",(err,decode)=>{
             if(decode){
                console.log(decode);
                req.role = decode.role;
                next();
             }else{
                 res.status(400).json({msg:"Invalid credencial"})
             }
            })
        }
        
     } catch (error) {
        res.status(400).json({msg:"You are not Login Please Login"})
     }
}

module.exports = {
    auth
}