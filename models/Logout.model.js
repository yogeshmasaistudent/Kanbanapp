const mongoose = require("mongoose");
const LogoutSchema = mongoose.Schema({
    token:{
        type:String,
        required:true,
    },
    LogoutAt:{
        type:Date,
        default:Date.now,
    }
})

const LogoutUser = mongoose.model("LogoutUser",LogoutSchema);


module.exports = {
    LogoutUser
}