const express = require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest"); 
const User = require("../models/user");
//const sendEmail = require("../util/email");  // aisa kuch banaya hi nhi hai to kyu import kiya hai isko, comment hatane per error bhi aa raha hai

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
          const fromUserId = req.user._id;
          const toUserId = req.params.toUserId;
          const status = req.params.status;
          
          const allowedStatus = ["ignore","interested", "accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({message:"Invalid status value"});
            }
            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({message:"user not found"});
            }
            const existingConnectionRequest = await ConnectionRequest.findOne({ 
                $or: [
                    { fromUserId , toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });
            if (existingConnectionRequest) {
                return res.status(400).json({message:"Connection request already exists"});
            }
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data=await connectionRequest.save();
            res.json({message:req.user.firstName+" is "+status+" in "+toUser.firstName, data});
        } catch (err) {
            res.status(400).send("Error in sending connection request" + err);
      }
});

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);




module.exports=requestRouter;





 