const express = require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    //ye bhi copy kiya hai so make it working first
    const user=req.user;
     console.log("sending a connection Request");
     res.send(user.firstName+"sent the connection Request");
});
module.exports=requestRouter;




// //pehle uppar wala code completely run kervao fir E12 ka code niche wala run kerna 
// //.
// //.
// //.
// const ConnectionRequest=require("./models/connectionrequest");
// const User=require("../models/userr");
// const sendEmail=require("../util/sendEmail");//ye to banay hi nahi hai abhi tak

// requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
//     try{
//        const fromUserId=req.User._id;
//        const toUserId=req.params.toUserId;
//        const status= req.params.status;

//        const allowedStatus=["ignore","interested"];
//        if(!allowedStatus.includes(status)){
//         return res.send(400).json({mesage:"invalid status"});
//        }

//        const toUser=await User.findById(toUserId);
//        if(!toUser){
//         res.status(404).json({message:"user not found"});
//        }


// const existingConnectionRequest=await ConnectionRequest.findOne({
//     $or:[
//         {fromUserId,toUserId},
//         {fromUserId:toUserId, toUserId: fromUserId},
//     ]
// });
// if(existingConnectionRequest){
//     return res.status(400).json({message:"connection request already exists"});
// }

// const connectionRequest=new ConnectionRequest({
//     fromUserId,
//     toUserId,
//     status,
// })

// const data=await connectionRequest.save();

// // const emailRes=await sendEmail.run(
// //     "a new friend request from "+req.user.firstname, 
// //     req.user.firstName+"is"+status+"in"+toUser.findName
// // );
// // console.log(emailRes);

// res.json({
//     mesage:req.user.firstName+"is"+status+"in"+toUser.firstName,data,
// });

// }catch(err){
//         res.status(400).send("error"+err.message);
//     }
// })

 module.exports =requestRouter





 