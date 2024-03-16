const express = require("express");
const { UserModel } = require("../models/user.models");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { LogoutUser } = require("../models/Logout.model");
const { auth } = require("../middlwares/auth.middleware");

// Registation Route
UserRouter.post("/register", async (req, res) => {
  const { username, email, password,role} = req.body;
  try {
    const user = await UserModel.findOne({ email: email, username: username });
    if (user) {
      res.status(200).json({ msg: "You are allready register Login Please" });
    } else {
      const hashPassword = await bcrypt.hash(password, 5);
      const New_User = new UserModel({
        username: username,
        email: email,
        password: hashPassword,
        role:role,
      });
      await New_User.save();
      res.status(200).json({ msg: "User has been register Now You can LogIn" });
    }
  } catch (error) {
    res.status(200).json({ msg: "User has some Issue" });
  }
});

// LogIn Routes
UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const isValidPassword = bcrypt.compare(password, user.password);
      if (isValidPassword) {
        // if i want genrate toke here can do
        const token = jwt.sign(
          { UserID: user._id, role:user.role},
          "yogesh"
        );
        res.status(200).json({ msg: "Login Succesefull!", token });
      } else {
        res.status(400).json({ msg: "Invalid Creadential Please tye again" });
      }
    } else {
      res.status(401).json({ msg: "User not Found Register First" });
    }
  } catch (error) {
    res.status(400).json({ msg: "Login Failed" });
  }
});



// Logout Functionalty =>
UserRouter.post("/logout", auth, async (req, res) => {
    const token = req.headers.authorization;
  try {
    if(token){
        const user = new LogoutUser({token})
         await user.save();
         res.status(200).json({msg:"User Logout Succesefully"})
    }else{
        res.json({msg:"You are allready Logout"})
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Error" });
  }
});

module.exports = {
  UserRouter,
};
