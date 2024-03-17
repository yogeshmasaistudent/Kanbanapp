const express = require("express");
const { UserModel } = require("../models/user.models");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { LogoutUser } = require("../models/Logout.model");
const { auth } = require("../middlwares/auth.middleware");

// Now i am writing swagger documentation => 


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: john_doe
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *           example: password123
 *         role:
 *           type: string
 *           description: The user's role.
 *           example: admin
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *           example: password123
 *     Logout:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authentication.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 */


// Now i am writing swagger doucumatation for Registation Router 

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     description: Register a new user and save it to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       '200':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Registration success message.
 *                   example: User has been registered. You can now log in.
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
 */

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


// Swagger documatation code for LogIn Router 


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in with existing credentials.
 *     tags: [Authentication]
 *     description: Log in with existing credentials and generate an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Login success message.
 *                   example: Login successful!
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       '400':
 *         description: Bad request. Invalid credentials.
 *       '401':
 *         description: Unauthorized. User not found.
 *       '500':
 *         description: Internal server error.
 */


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


// Swagger Documatation for Logout funtionalty code is here => 

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out the current user.
 *     tags: [Authentication]
 *     description: Log out the user and invalidate the authentication token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully.
 *       '401':
 *         description: Unauthorized. Invalid or expired token.
 *       '500':
 *         description: Internal server error.
 */


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
