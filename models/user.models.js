const mongoose = require("mongoose");

// Kan banUser Model Schema =>
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "User"],
    default: "User",
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
  UserModel,
};
