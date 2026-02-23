const express = require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
//const sendEmail = require("../util/email"); // aisa kuch banaya hi nhi hai to kyu import kiya hai isko, comment hatane per error bhi aa raha hai

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
     console.log("sending a connection Request");
     res.send(user.firstName+" sent the connection request");
});

module.exports=requestRouter;





 