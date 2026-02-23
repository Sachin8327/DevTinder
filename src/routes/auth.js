const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../util/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");

authRouter.post("/signUp",async(req,res)=>{
    try{ 
          validateSignUpData(req);

          const {firstName,lastName,emailId,password,age}=req.body;

          const passwordHash=await bcrypt.hash(password,10);
          console.log(passwordHash);

          const user=new User({
               firstName,lastName,emailId,
               password:passwordHash,age
          });
          await user.save();
           res.send("user added successfully");
      }catch(err){
          res.status(400).send("error in adding user"+err.message);
      }
});

// //ye abhi working nhi hai pehle app.js ka code sahi karo fir ye sahi ho payega 
// authRouter.post("/login",async(req,res)=>{
//     try{
//           const {emailId,password}=req.body;
//           const user =await User.findOne({emailId:emailId});
//           if(!user){
//                throw new Error("Invalid credential");
//           }
//           const isPasswordValid= await bcrypt.compare(password,user.password);
//           if(isPasswordValid){
//                const token =await jwt.sign({_id:user._id},"password");
//                console.log(token);
//                res.cookie("token",token,{ httpOnly: true },{expires:new Date(Data.now()+8*3600000)});
//                res.send("login successfully");
//           }else{
//                res.send("invalid credential");
//           }
//      }catch(err){
//           res.status(400).send("error in login "+err.message);
//      }
// });

// authRouter.post("/logout",async(req,res)=>{
//     res.cookie("token", null ,{expires:new Date(Date.now()), });
//     res.send("logout successfully");
// });

module.exports=authRouter;
