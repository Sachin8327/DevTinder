const express=require("express");
const authRouter= express.Router();
const User = require("../models/user");
const { validatorSignupData } = require("../util/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
    try {
          validatorSignupData(req);
          const { firstName, lastName, emailId, password } = req.body;
          const passwordHash = await bcrypt.hash(password, 10);
          console.log(passwordHash);

          const user = new User({
               firstName,
               lastName,
               emailId,
               password: passwordHash
          });
          await user.save();
          res.send("user added successfully");
     } catch (err) {
          res.status(400).send("Error  in signing up" + err);
     }
});

authRouter.post("/login", async (req, res) => {
    try {
          const { emailId, password } = req.body;
          const user = await User.findOne({ emailId: emailId });
          if (!user) {
               throw new Error("invalid credentials");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
               const token = await jwt.sign({ _id: user._id}, "password", {expiresIn: "1h"});
               console.log(token);
               res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});
               res.send("login successful");
          } else {
               throw new Error("invalid credentials");
          }
     } catch (err) {
          res.status(400).send("Error in logging in" + err);
     }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null,{expires: new Date(Date.now())});
    res.send("logout successful");
});



module.exports=authRouter;
