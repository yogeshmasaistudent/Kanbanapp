
const  access = (...parameter)=>{
    return(req,res,next)=>{
        if(parameter.includes(req.role)){
            next();
        }else{
            res.status(400).json({msg:"User is not authorized"})
        }
    }
}

module.exports ={
    access
}